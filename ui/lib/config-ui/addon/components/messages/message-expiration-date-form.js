{{!
  Copyright (c) HashiCorp, Inc.
  SPDX-License-Identifier: BUSL-1.1
~}}

{{! template-lint-configure simple-unless "warn" }}
<div class="field" data-test-field={{or @attr.name true}}>
  {{#unless this.hideLabel}}
    <FormFieldLabel
      for={{@attr.name}}
      @label={{this.labelString}}
      @helpText={{(if this.showHelpText @attr.options.helpText)}}
      @subText={{@attr.options.subText}}
      @docLink={{@attr.options.docLink}}
    />
  {{/unless}}
  {{#if @attr.options.possibleValues}}
    {{#if (eq @attr.options.editType "radio")}}
      <div class="control {{unless this.isRadioGroup 'columns'}}" data-test-radio-input>
        {{#each (path-or-array @attr.options.possibleValues @model) as |val|}}
          <div
            class="is-flex-center
              {{unless
                this.isRadioGroup
                'column is-narrow has-text-grey has-right-margin-s'
                'has-top-padding-xs has-bottom-padding-s'
              }}"
            data-test-input={{@attr.name}}
          >
            <RadioButton
              class="radio"
              name={{@attr.name}}
              id={{or val.value val}}
              value={{or val.value val}}
              @value={{or val.value val}}
              @onChange={{this.setAndBroadcast}}
              @groupValue={{(get @model this.valuePath)}}
              @disabled={{and @attr.options.editDisabled (not @model.isNew)}}
            />
            <div class="has-left-margin-xs">
              <label
                for="{{or val.value val}}"
                class="has-left-margin-xs {{if this.isRadioGroup 'has-text-black is-size-7'}}"
              >
                {{or val.label val.value val}}
                {{#if this.isRadioGroup}}
                  <div class="has-left-margin-xs has-text-grey is-size-8">
                    {{val.helperText}}
                  </div>
                {{/if}}
              </label>
            </div>
          </div>
        {{/each}}
      </div>
    {{else}}
      <div class="control is-expanded">
        <div class="select is-fullwidth">
          <select
            class="{{if this.validationError 'has-error-border'}}"
            name={{@attr.name}}
            id={{@attr.name}}
            onchange={{this.onChangeWithEvent}}
            data-test-input={{@attr.name}}
          >
            {{#if @attr.options.noDefault}}
              <option value="">
                Select one
              </option>
            {{/if}}
            {{#each (path-or-array @attr.options.possibleValues @model) as |val|}}
              <option selected={{loose-equal (get @model this.valuePath) (or val.value val)}} value={{or val.value val}}>
                {{or val.displayName val}}
              </option>
            {{/each}}
          </select>
        </div>
      </div>
    {{/if}}
  {{else if (eq @attr.options.editType "dateTimeLocal")}}
    <Input
      @type="datetime-local"
      @value={{date-format (get @model this.valuePath) "yyyy-MM-dd'T'HH:mm"}}
      class="input has-top-margin-xs is-auto-width is-block"
      name="startTime"
      data-test-input="startTime"
      {{on "input" this.setAndBroadcastDatetimeLocal}}
    />
  {{else if (eq @attr.options.editType "searchSelect")}}
    <div class="form-section">
      <SearchSelect
        @id={{@attr.name}}
        @models={{@attr.options.models}}
        @onChange={{this.setAndBroadcast}}
        @inputValue={{get @model this.valuePath}}
        @wildcardLabel={{@attr.options.wildcardLabel}}
        @label={{this.labelString}}
        @labelClass={{if @attr.options.isSectionHeader "title is-4" "is-label"}}
        @subText={{@attr.options.subText}}
        @helpText={{@attr.options.helpText}}
        @fallbackComponent={{@attr.options.fallbackComponent}}
        @selectLimit={{@attr.options.selectLimit}}
        @backend={{@model.backend}}
        @disallowNewItems={{@attr.options.onlyAllowExisting}}
        class={{if this.validationError "dropdown-has-error-border"}}
      />
    </div>
  {{else if (eq @attr.options.editType "mountAccessor")}}
    <MountAccessorSelect
      @name={{@attr.name}}
      @label={{this.labelString}}
      @helpText={{@attr.options.helpText}}
      @value={{get @model this.valuePath}}
      @onChange={{this.setAndBroadcast}}
    />
  {{else if (eq @attr.options.editType "kv")}}
    {{! KV Object Editor }}
    <KvObjectEditor
      @value={{get @model this.valuePath}}
      @onChange={{this.setAndBroadcast}}
      @label={{this.labelString}}
      @labelClass="title {{if (eq @mode 'create') 'is-5' 'is-4'}}"
      @helpText={{@attr.options.helpText}}
      @subText={{@attr.options.subText}}
      @onKeyUp={{this.handleKeyUp}}
      @validationError={{this.validationError}}
      class="form-section"
    />
  {{else if (eq @attr.options.editType "file")}}
    {{! File Input }}
    <div class="has-bottom-margin-m">
      <TextFile
        @label={{this.labelString}}
        @subText={{@attr.options.subText}}
        @helpText={{@attr.options.helpText}}
        @docLink={{@attr.options.docLink}}
        @onChange={{this.setFile}}
        @validationError={{this.validationError}}
      />
    </div>
  {{else if (eq @attr.options.editType "ttl")}}
    {{! TTL Picker }}
    <div class="field">
      {{#let (or (get @model this.valuePath) @attr.options.setDefault) as |initialValue|}}
        <TtlPicker
          data-test-input={{@attr.name}}
          class={{if this.validationError "ttl-picker-form-field-error"}}
          @onChange={{this.setAndBroadcastTtl}}
          @label={{this.labelString}}
          @helperTextDisabled={{or @attr.options.helperTextDisabled "Vault will use the default lease duration."}}
          @helperTextEnabled={{or @attr.options.helperTextEnabled "Lease will expire after"}}
          @description={{@attr.helpText}}
          @initialValue={{initialValue}}
          @initialEnabled={{if (eq initialValue "0s") false initialValue}}
          @hideToggle={{@attr.options.hideToggle}}
        />
      {{/let}}
    </div>
  {{else if (eq @attr.options.editType "regex")}}
    {{! Regex Validated Input }}
    <RegexValidator
      @attr={{@attr}}
      @labelString={{this.labelString}}
      @value={{or (get @model this.valuePath) @attr.options.defaultValue}}
      @onChange={{this.onChangeWithEvent}}
    />
  {{else if (eq @attr.options.editType "optionalText")}}
    {{! Togglable Text Input }}
    <Toggle
      @name="show-{{@attr.name}}"
      @onChange={{this.toggleShow}}
      @checked={{this.showInput}}
      data-test-toggle={{@attr.name}}
    >
      <span class="ttl-picker-label is-large">{{this.labelString}}</span><br />
      <div class="description has-text-grey">
        {{#if this.showInput}}
          <span>
            {{@attr.options.subText}}
            {{#if @attr.options.docLink}}
              <DocLink @path={{@attr.options.docLink}}>
                See our documentation
              </DocLink>
              for help.
            {{/if}}
          </span>
        {{else}}
          <span>
            {{or @attr.options.defaultSubText "Vault will use the engine default."}}
            {{#if @attr.options.docLink}}
              <DocLink @path={{@attr.options.docLink}}>
                See our documentation
              </DocLink>
              for help.
            {{/if}}
          </span>
        {{/if}}
      </div>
      {{#if this.showInput}}
        <input
          data-test-input={{@attr.name}}
          id={{@attr.name}}
          autocomplete="off"
          spellcheck="false"
          value={{or (get @model this.valuePath) @attr.options.defaultValue}}
          onchange={{this.onChangeWithEvent}}
          class="input"
          maxLength={{@attr.options.characterLimit}}
        />
      {{/if}}
    </Toggle>
  {{else if (eq @attr.options.editType "stringArray")}}
    <StringList
      class={{if this.validationError "string-list-form-field-error"}}
      data-test-input={{@attr.name}}
      @label={{this.labelString}}
      @helpText={{if this.showHelpText @attr.options.helpText}}
      @inputValue={{get @model this.valuePath}}
      @onChange={{this.setAndBroadcast}}
      @attrName={{@attr.name}}
      @subText="{{@attr.options.subText}} Add one item per row."
    />
  {{else if (eq @attr.options.sensitive true)}}
    <MaskedInput
      @name={{@attr.name}}
      @value={{or (get @model this.valuePath) @attr.options.defaultValue}}
      @allowCopy="true"
      @onChange={{this.setAndBroadcast}}
      @onKeyUp={{@onKeyUp}}
    />
  {{else if (or (eq @attr.type "number") (eq @attr.type "string"))}}
    <div class="control">
      {{#if (eq @attr.options.editType "textarea")}}
        {{! Text area }}
        <textarea
          data-test-input={{@attr.name}}
          id={{@attr.name}}
          value={{or (get @model this.valuePath) @attr.options.defaultValue}}
          oninput={{this.onChangeWithEvent}}
          class="textarea {{if this.validationError 'has-error-border'}}"
        ></textarea>
      {{else if (eq @attr.options.editType "password")}}
        <Input
          data-test-input={{@attr.name}}
          @type="password"
          @value={{get @model this.valuePath}}
          name={{@attr.name}}
          class="input"
          {{! Prevents browsers from auto-filling }}
          autocomplete="new-password"
          spellcheck="false"
        />
      {{else if (eq @attr.options.editType "json")}}
        {{! JSON Editor }}
        {{#let (get @model this.valuePath) as |value|}}
          <JsonEditor
            data-test-input={{@attr.name}}
            @title={{this.labelString}}
            @value={{if
              value
              (if (eq @attr.options.mode "ruby") value (stringify (jsonify value)))
              @attr.options.defaultValue
            }}
            @valueUpdated={{fn this.codemirrorUpdated true}}
            @theme={{or @attr.options.theme "hashi"}}
            @helpText={{@attr.options.helpText}}
            @mode={{@attr.options.mode}}
            @example={{@attr.options.example}}
          >
            {{#if @attr.options.allowReset}}
              <Hds::Button
                @text="Clear"
                @icon="reload"
                class="toolbar-button"
                disabled={{not value}}
                {{on "click" this.setAndBroadcast}}
                data-test-json-clear-button
              />
            {{/if}}
          </JsonEditor>
        {{/let}}
        {{#if @attr.options.subText}}
          <p class="sub-text">
            {{@attr.options.subText}}
            {{#if @attr.options.docLink}}
              <DocLink @path={{@attr.options.docLink}}>
                See our documentation
              </DocLink>
              for help.
            {{/if}}
          </p>
        {{/if}}
      {{else}}
        {{! Regular Text Input }}
        <input
          data-test-input={{@attr.name}}
          id={{@attr.name}}
          readonly={{this.isReadOnly}}
          disabled={{and @attr.options.editDisabled (not @model.isNew)}}
          autocomplete="off"
          spellcheck="false"
          value={{get @model this.valuePath}}
          {{on "change" this.onChangeWithEvent}}
          {{on "input" this.onChangeWithEvent}}
          {{on "keyup" this.handleKeyUp}}
          class="input {{if this.validationError 'has-error-border'}}"
          maxLength={{@attr.options.characterLimit}}
        />
      {{/if}}
    </div>
  {{else if (or (eq @attr.type "boolean") (eq @attr.options.editType "boolean"))}}
    <div class="b-checkbox">
      <input
        disabled={{this.disabled}}
        type="checkbox"
        id={{@attr.name}}
        class="styled"
        checked={{get @model @attr.name}}
        onchange={{this.onChangeWithEvent}}
        data-test-input={{@attr.name}}
      />
      <label for={{@attr.name}} class="is-label">
        {{this.labelString}}
        {{#if (and this.showHelpText @attr.options.helpText)}}
          <InfoTooltip>{{@attr.options.helpText}}</InfoTooltip>
        {{/if}}
      </label>
      {{#if @attr.options.subText}}
        <p class="sub-text">
          {{@attr.options.subText}}
          {{#if @attr.options.docLink}}
            <DocLink @path={{@attr.options.docLink}}>
              Learn more here.
            </DocLink>
          {{/if}}
        </p>
      {{/if}}
    </div>
  {{else if (eq @attr.type "object")}}
    <JsonEditor
      @title={{this.labelString}}
      @value={{if (get @model this.valuePath) (stringify (get @model this.valuePath)) this.emptyData}}
      @valueUpdated={{fn this.codemirrorUpdated false}}
      @helpText={{@attr.options.helpText}}
      @example={{@attr.options.example}}
    />
  {{else if (eq @attr.options.editType "yield")}}
    {{yield}}
  {{/if}}
  {{#if this.validationError}}
    <AlertInline
      @type="danger"
      @message={{this.validationError}}
      @paddingTop={{not-eq @attr.options.editType "ttl"}}
      data-test-field-validation={{@attr.name}}
      class={{if (eq @attr.options.editType "stringArray") "has-top-margin-negative-xxl"}}
    />
  {{/if}}
  {{#if this.validationWarning}}
    <AlertInline
      @type="warning"
      @message={{this.validationWarning}}
      @paddingTop={{if (and (not this.validationError) (eq @attr.options.editType "ttl")) false true}}
      data-test-validation-warning={{@attr.name}}
      class={{if (and (not this.validationError) (eq @attr.options.editType "stringArray")) "has-top-margin-negative-xxl"}}
    />
  {{/if}}
</div>