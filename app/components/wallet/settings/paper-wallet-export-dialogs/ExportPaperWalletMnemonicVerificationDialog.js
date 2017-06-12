// @flow
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import Dialog from 'react-toolbox/lib/dialog/Dialog';
import Input from 'react-toolbox/lib/input/Input';
import { defineMessages, intlShape } from 'react-intl';
import ReactToolboxMobxForm from '../../../../lib/ReactToolboxMobxForm';
import DialogCloseButton from '../../../widgets/DialogCloseButton';
import DialogBackButton from '../../../widgets/DialogBackButton';
import globalMessages from '../../../../i18n/global-messages';
import LocalizableError from '../../../../i18n/LocalizableError';
import styles from './ExportPaperWalletMnemonicVerificationDialog.scss';

const messages = defineMessages({
  headline: {
    id: 'paper.wallet.export.dialog.mnemonic.verification.headline',
    defaultMessage: '!!!Verify mnemonic',
    description: 'headline for mnemonic certificate verification dialog.'
  },
  continueLabel: {
    id: 'paper.wallet.export.dialog.mnemonic.verification.button.continueLabel',
    defaultMessage: '!!!Continue',
    description: 'Label "Continue" on mnemonic certificate verification dialog'
  },
  mnemonicVerificationInputLabel: {
    id: 'paper.wallet.export.dialog.mnemonic.verification.recovery.phrase.input.label',
    defaultMessage: '!!!Recovery phrase',
    description: 'Label for the recovery phrase input on mnemonic certificate verification dialog.'
  },
  mnemonicVerificationInputHint: {
    id: 'paper.wallet.export.dialog.mnemonic.verification.recovery.phrase.input.hint',
    defaultMessage: '!!!Enter recovery phrase',
    description: 'Hint "Enter recovery phrase" for the recovery phrase input on the mnemonic certificate verification dialog.'
  },
  invalidMnemonic: {
    id: 'paper.wallet.export.dialog.mnemonic.verification.form.errors.invalidRecoveryPhrase',
    defaultMessage: '!!!Invalid recovery phrase',
    description: 'Error message shown when invalid recovery phrase was entered on mnemonic certificate verification dialog.'
  },
});

messages.fieldIsRequired = globalMessages.fieldIsRequired;

@observer
export default class ExportPaperWalletMnemonicVerificationDialog extends Component {

  props: {
    onContinue: Function,
    onClose: Function,
    onBack: Function,
    isSubmitting: boolean,
    walletExportMnemonic: string,
    error: ?LocalizableError,
  };

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  state = {
    isValidRecoveryPhrase: false,
  }

  form = new ReactToolboxMobxForm({
    fields: {
      recoveryPhrase: {
        label: this.context.intl.formatMessage(messages.mnemonicVerificationInputLabel),
        placeholder: this.context.intl.formatMessage(messages.mnemonicVerificationInputHint),
        value: '',
        validators: ({ field }) => {
          const value = field.value;
          if (value === '') return [false, this.context.intl.formatMessage(messages.fieldIsRequired)];
          return [
            this.walletExportMnemonicValidator(field.value),
            this.context.intl.formatMessage(messages.invalidMnemonic)
          ];
        },
        bindings: 'ReactToolbox',
      },
    },
  }, {
    options: {
      validateOnChange: true,
      validationDebounceWait: 250,
    },
  });

  walletExportMnemonicValidator = (value :string) => {
    const isValidRecoveryPhrase = value === this.props.walletExportMnemonic;
    this.setState({ isValidRecoveryPhrase });
    return isValidRecoveryPhrase;
  }

  submit = () => {
    this.form.submit({
      onSuccess: (form) => {
        const { recoveryPhrase } = form.values();
        const walletData = {
          recoveryPhrase,
        };
        this.props.onContinue(walletData);
      },
      onError: () => {}
    });
  };

  render() {
    const { intl } = this.context;
    const { form } = this;
    const { isSubmitting, error, onClose, onBack } = this.props;
    const dialogClasses = classnames([
      styles.component,
      'ExportPaperWalletMnemonicVerificationDialog',
      isSubmitting ? styles.isSubmitting : null
    ]);

    const actions = [
      {
        label: intl.formatMessage(messages.continueLabel),
        primary: true,
        disabled: !this.state.isValidRecoveryPhrase,
        onClick: () => this.submit(),
      }
    ];

    return (
      <Dialog
        className={dialogClasses}
        title={intl.formatMessage(messages.headline)}
        actions={actions}
        onOverlayClick={onClose}
        active
      >

        <div className={styles.instructions}>
          <p>Enter words in the correct order to verify your mnemonic.</p>
        </div>

        <Input
          className="recoveryPhrase"
          multiline
          rows={3}
          {...form.$('recoveryPhrase').bind()}
        />

        {error && <p className={styles.error}>{intl.formatMessage(error)}</p>}

        <DialogBackButton onBack={onBack} />
        <DialogCloseButton onClose={onClose} />

      </Dialog>
    );
  }

}
