export interface NoticeDialogDataModel {
  id: string;
  title: string;
  text: string;
  actionBtnText: string;
  dismissBtnText?: string;
  type?: 'info' | 'warn';
}
