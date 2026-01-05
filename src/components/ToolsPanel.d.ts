import type { AegisStatus, ToolSettings } from "../types.js";
type Props = {
    settings: ToolSettings;
    onSettingsChange: (next: ToolSettings) => void;
    onAegisStatus: (status: AegisStatus) => void;
};
export default function ToolsPanel({ settings, onSettingsChange, onAegisStatus }: Props): import("react/jsx-runtime").JSX.Element;
export {};
