import { useDraggable, useOpacity, useTitle } from '../../hooks/document';
import styles from './testOverlay.module.css';

export default function TestOverlayApp() {
  useTitle('Test Overlay');
  useDraggable();
  useOpacity();

  return (
    <div className="overlayWindow overlayDefaultBackgroundColor">
      <div className={styles.container}>
        <img
          src="https://placehold.co/300x200/1a1a2e/ffffff?text=Test+Overlay"
          alt="Test overlay placeholder"
          className={styles.image}
        />
        <div className={styles.label}>Test Overlay</div>
      </div>

      <div id="draggableWrapper">TEST OVERLAY WINDOW</div>
    </div>
  );
}
