export enum RegisterActionTypes {
    STORE_SIGNING_MNEMONIC = "STORE_SIGNING_MNEMONIC",
    STORE_SIGNING_VERIFICATION_STATUS = "STORE_SIGNING_VERIFICATION_STATUS",
    STORE_SIGNING_KEY = "STORE_SIGNING_KEY",

    STORE_WITHDRAWAL_MNEMONIC = "STORE_WITHDRAWAL_MNEMONIC",
    STORE_WITHDRAWAL_VERIFICATION_STATUS = "STORE_WITHDRAWAL_VERIFICATION_STATUS",
    STORE_WITHDRAWAL_KEY = "STORE_WITHDRAWAL_KEY",

    START_REGISTRATION_SUBMISSION = "START_REGISTRATION_SUBMISSION",
    COMPLETED_REGISTRATION_SUBMISSION = "COMPLETED_REGISTRATION_SUBMISSION"
}

export enum DepositActionTypes {
    GENERATE_DEPOSIT = "GENERATE_DEPOSIT",
    DEPOSIT_TRANSACTION = "DEPOSIT_TRANSACTION",
    DEPOSIT_VISIBLE = "DEPOSIT_VISIBLE"
}

export enum AuthActionTypes {
    STORE_AUTH = "STORE_AUTH"
}

export enum NotificationActionTypes {
    ADD_NOTIFICATION = "ADD_NOTIFICATION"
}