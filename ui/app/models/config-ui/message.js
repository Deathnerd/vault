{{!
  Copyright (c) HashiCorp, Inc.
  SPDX-License-Identifier: BUSL-1.1
~}}

<Messages::TabPageHeader
  @authenticated={{@message.authenticated}}
  @pageTitle="{{if @message.isNew 'Create' 'Edit'}} message"
  @breadcrumbs={{this.breadcrumbs}}
/>

<form id="message-create-edit-form" {{on "submit" (perform this.save)}} data-test-form="create-and-edit">
  <div class="box is-sideless is-fullwidth is-marginless has-top-padding-s">
    <Hds::Text::Body @tag="p" class="has-bottom-margin-l" data-test-form-subtext>
      {{if @message.isNew "Create" "Edit"}}
      a custom message for all users when they access a Vault system via the UI.
    </Hds::Text::Body>

    <MessageError @errorMessage={{this.errorBanner}} class="has-top-margin-s" />

    {{#each @message.formFields as |attr|}}
      {{#if (eq attr.name "linkTitle")}}
        <div class="field has-bottom-margin-m">
          <label for="link" class="is-label">Link
            <span class="has-text-grey-400 has-font-weight-normal">(optional)</span></label>
          <div class="control is-flex-between has-gap-m">
            <Input
              @type="text"
              @value={{@message.linkTitle}}
              placeholder="Display text (e.g. Learn more)"
              id="link-title"
              class="input"
              data-test-field="linkTitle"
              {{on "input" (pipe (pick "target.value") (fn (mut @message.linkTitle)))}}
            />
            <Input
              @type="text"
              @value={{@message.linkHref}}
              placeholder="Paste URL (e.g. www.learnmore.com)"
              id="link-href"
              class="input"
              data-test-field="linkHref"
              {{on "input" (pipe (pick "target.value") (fn (mut @message.linkHref)))}}
            />
          </div>
        </div>
      {{else}}
        <FormField
          @attr={{attr}}
          @model={{@message}}
          @modelValidations={{this.modelValidations}}
          class="has-bottom-margin-m"
          data-test-field={{true}}
        >
          <Messages::MessageExpirationDateForm @message={{@message}} @attr={{attr}} />
        </FormField>
      {{/if}}
    {{/each}}

    <Hds::ButtonSet class="has-top-margin-s has-bottom-margin-m has-top-margin-xl">
      {{! TODO: VAULT-21533 preview modal }}
      <Hds::Button @text="Preview" @color="tertiary" @icon="eye" />

      <Hds::Button
        @text="{{if @message.isNew 'Create' 'Edit'}} message"
        disabled={{(or this.invalidFormMessage this.save.isRunning)}}
        data-test-button="create-message"
        type="submit"
      />

      <Hds::Button
        @text="Cancel"
        @color="secondary"
        @route="messages.index"
        @query={{hash authenticated=@message.authenticated}}
      />
    </Hds::ButtonSet>
  </div>
</form>