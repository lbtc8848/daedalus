// @flow
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import Dialog from 'react-toolbox/lib/dialog/Dialog';
import { defineMessages, intlShape } from 'react-intl';
import DialogCloseButton from '../../../widgets/DialogCloseButton';
import DialogBackButton from '../../../widgets/DialogBackButton';
import styles from './ExportPaperWalletCertificateDialog.scss';

const messages = defineMessages({
  headline: {
    id: 'paper.wallet.export.dialog.certificate.dialog.headline',
    defaultMessage: '!!!Paper certificate',
    description: 'headline for " for paper wallet mnemonic certificate dialog.'
  },
  finishLabel: {
    id: 'paper.wallet.export.dialog.certificate.button.finishLabel',
    defaultMessage: '!!!Finish',
    description: 'Label "Finish" for paper wallet mnemonic certificate dialog.'
  },
});

@observer
export default class ExportPaperWalletCertificateDialog extends Component {

  props: {
    onFinish: Function,
    onClose: Function,
    onBack: Function,
  };

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  render() {
    const { intl } = this.context;
    const { onClose, onBack, onFinish } = this.props;
    const dialogClasses = classnames([
      styles.component,
      'ExportPaperWalletCertificateDialog',
    ]);

    const actions = [
      {
        label: intl.formatMessage(messages.finishLabel),
        primary: true,
        onClick: () => onFinish(),
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
          <p>
            Now you can fold your paper certificate and glue together all the parts.
            Keep certificate safe.
            To import wallet back crop glued certificate’s edges to reach inner part.
          </p>
        </div>

        <DialogBackButton onBack={onBack} />
        <DialogCloseButton onClose={onClose} />

      </Dialog>
    );
  }

}
