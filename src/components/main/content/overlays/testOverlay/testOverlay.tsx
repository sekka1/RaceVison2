import { StoreLocations } from '../../../../../constants/storeLocations';
import { MainHeader } from '../../header';

export function TestOverlayContent() {
  return (
    <div>
      <MainHeader text="Test Overlay" windowName={StoreLocations.TEST_OVERLAY} />
      <div>
        A simple test overlay for verifying overlay functionality without
        requiring iRacing to be running. Use this to test positioning, opacity,
        and dragging behavior.
      </div>
      <p>This overlay displays a placeholder image and does not use any iRacing data.</p>
    </div>
  );
}
