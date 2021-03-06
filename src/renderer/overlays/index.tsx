import React from "react";
import {NotificationRenderer} from "./NotificationRenderer";
import {DockerDemonNotificator} from "./DockerDemonNotificator";
import {GlobalLoader} from "./GlobalLoader";
import discord from "../assets/img/logo/Discord-Logo-White.svg";
import ReactTooltip from "react-tooltip";
import {shell} from "electron";

export const Overlays: React.FC = () => {
    const onDiscordClick = (): void => {
        shell.openExternal("https://discord.gg/uM9rZFDefm");
    };

    return (
        <>
            <NotificationRenderer />
            <DockerDemonNotificator />
            <GlobalLoader />
            <div className='discord-overlay'>
                <ReactTooltip id='discord' place='right' className='hover-width' />
                <div onClick={onDiscordClick} data-tip='Contact support' className='container' data-for='discord'>
                    <img src={discord} />
                </div>
            </div>
            <div className='version-overlay'>v{process.env.npm_package_version}</div>
        </>
    );
};
