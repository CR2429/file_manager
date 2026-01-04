import { Controls, ControlButton } from 'reactflow'

export default function BlueprintControls(  { onOpenApiTokenModal }) {
    return (
        <Controls>
            <ControlButton
                title="API Token"
                onClick={onOpenApiTokenModal}
            >
                🔑
            </ControlButton>
        </Controls>
    );
};