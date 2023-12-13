{{!
  Copyright (c) HashiCorp, Inc.
  SPDX-License-Identifier: BUSL-1.1
~}}

<div class="has-top-padding-xs has-bottom-padding-s is-narrow is-flex-align-baseline">
  <RadioButton
    class="radio"
    name={{@attr.name}}
    id="never"
    value="never"
    @value="never"
    @onChange={{fn (mut @message.endTime) ""}}
    @groupValue={{this.groupValue}}
  />
  <div class="has-left-margin-xs">
    <label for="never" class="has-left-margin-xs has-text-black is-size-7">
      Never
      <div class="has-left-margin-xs has-text-grey is-size-8">
        This message will never expire unless manually deleted by an operator.
      </div>
    </label>
  </div>
</div>

<div class="has-top-padding-xs has-bottom-padding-s is-narrow is-flex-align-baseline">
  <RadioButton
    class="radio"
    name={{@attr.name}}
    id="specificDate"
    value="specificDate"
    @value="specificDate"
    @onChange={{(fn (mut this.groupValue) "specificDate")}}
    @groupValue={{this.groupValue}}
  />
  <div class="has-left-margin-xs">
    <label for="specificDate" class="has-left-margin-xs has-text-black is-size-7">
      Specific date
      <div class="has-left-margin-xs has-text-grey is-size-8">
        This message will expire at midnight (local timezone) at the specific date.
      </div>
      <div class="control has-left-margin-xs">
        <Input
          @type="datetime-local"
          @value={{date-format @message.endTime "yyyy-MM-dd'T'HH:mm"}}
          class="input has-top-margin-xs is-auto-width"
          name="endTime"
          data-test-input="endTime"
          {{on "input" (pipe (pick "target.value") (fn (mut @message.endTime)))}}
        />
      </div>
    </label>
  </div>
</div>