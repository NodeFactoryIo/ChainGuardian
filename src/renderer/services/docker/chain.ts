import {Container} from "./container";
import {DockerRegistry} from "./docker-registry";

type LogType = "info" | "error";
type LogCallbackFunc = (type: LogType, message: string) => void;

export enum SupportedNetworks {
    PRYSM = "Prysm",
}

export class BeaconChain extends Container {
    public static DefaultPorts = ["4000:4000", "13000:13000"];

    public static async startPrysmBeaconChain(
        ports = BeaconChain.DefaultPorts,
        waitUntilReady = false,
    ): Promise<BeaconChain> {
        const existingBC = DockerRegistry.getContainer(SupportedNetworks.PRYSM);
        if (existingBC) {
            return existingBC as BeaconChain;
        }

        const bc = new BeaconChain({
            image: "gcr.io/prysmaticlabs/prysm/beacon-chain:latest",
            name: BeaconChain.getContainerName(SupportedNetworks.PRYSM),
            restart: "unless-stopped",
            ports,
            volume: `${SupportedNetworks.PRYSM}-chain-data:/data`,
        });
        DockerRegistry.addContainer(SupportedNetworks.PRYSM, bc);

        await bc.run();
        if (waitUntilReady) {
            while (!(await bc.isRunning())) { /* */ }
        }
        return bc;
    }

    public static getContainerName(network: string): string {
        return `${network}-beacon-node`;
    }

    public listenToLogs(callback: LogCallbackFunc): void {
        const logs = this.getLogs();
        if (!logs) {
            throw new Error("Logs not found");
        }

        logs.stderr.on("data", function(message: string) {
            const isInfo = message.substr(0, 40).includes("level=info");
            const type = isInfo ? "info" : "error";
            callback(type, message);
        });
    }
}