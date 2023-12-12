/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: BUSL-1.1
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';
import errorMessage from 'vault/utils/error-message';
import { inject as service } from '@ember/service';
import { format, addDays, startOfDay } from 'date-fns';

import { localDateTimeString } from 'vault/models/config-ui/message';

/**
 * @module Page::CreateAndEditMessageForm
 * Page::CreateAndEditMessageForm components are used to display create and edit message form fields.
 * @example
 * ```js
 * <Page::CreateAndEditMessageForm @messages={{this.messages}} @authenticated={{this.model.authenticated}}  />
 * ```
 * @param {model} message - message model to pass to form components
 */

export default class MessagesList extends Component {
  @service router;
  @service flashMessages;

  @tracked errorBanner = '';
  @tracked modelValidations;
  @tracked invalidFormMessage;
  @tracked startTime;
  @tracked endTime;

  constructor() {
    super(...arguments);

    if (this.args.message.startTime) {
      this.startTime = format(
        addDays(startOfDay(new Date(this.args.message.startTime) || this.startTime), 1),
        localDateTimeString
      );
    }
    if (this.args.message.endTime) {
      this.endTime = format(new Date(this.args.message.endTime), localDateTimeString);
    }
  }

  get breadcrumbs() {
    const authenticated = this.args.authenticated === undefined ? true : this.args.authenticated;
    return [
      { label: 'Messages', route: 'messages.index', query: { authenticated } },
      { label: 'Create Message' },
    ];
  }

  @action
  updateRadioValue(evt) {
    this.args.message[evt.target.name] = evt.target.value;
  }

  @action
  updateDateTime(evt) {
    this[evt.target.name] = format(new Date(evt.target.value), localDateTimeString);
    this.args.message[evt.target.name] = new Date(evt.target.value);
  }

  @task
  *save(event) {
    event.preventDefault();
    try {
      const { isValid, state, invalidFormMessage } = this.args.message.validate();
      this.modelValidations = isValid ? null : state;
      this.invalidFormAlert = invalidFormMessage;

      if (isValid) {
        const { isNew } = this.args.message;
        if (typeof this.args.message.startTime === 'string')
          this.args.message.startTime = new Date(this.args.message.startTime);
        if (typeof this.args.message.endTime === 'string')
          this.args.message.endTime = new Date(this.args.message.endTime);
        const { id } = yield this.args.message.save();
        this.flashMessages.success(`Successfully ${isNew ? 'created' : 'updated'} the message.`);
        this.router.transitionTo('vault.cluster.config-ui.messages.message.details', id);
      }
    } catch (error) {
      this.errorBanner = errorMessage(error);
      this.invalidFormAlert = 'There was an error submitting this form.';
    }
  }
}
