import * as React from "react";
import {CopyButton} from "../Button/ButtonAction";

export interface ICopyFieldProps {
    value: string;
    label?: string;
    textAlign?: "right" | "left" | "center"
    onCopy?: () => void;
    clicked?: boolean;
    mnemonic?: boolean;
}

export const CopyField: React.FunctionComponent<ICopyFieldProps> = (
    props: ICopyFieldProps) => {
    
    return(
        <>
            <h3 className="copy-field-label">{props.label}</h3>
            <div className={`copy-field ${props.mnemonic ? "mnemonic":""}`}>
                <div className="copy-field-body" style={{textAlign: props.textAlign}}>
                    {props.value}
                </div>
                <CopyButton clicked={props.clicked} onClick={props.onCopy}/>
            </div>
        </>
    );
};

export const MnemonicCopyField: React.FunctionComponent<ICopyFieldProps> = (
    props: ICopyFieldProps) => {
    return(
        <CopyField clicked={props.clicked} mnemonic={true}
            value={props.value} onCopy={props.onCopy} label={props.label} />
    );
};