import './main.css';
import { Sidebar } from '../../components/main/sidebar';
import { MainContent } from '../../components/main/content';
import ContextProvider from '../../components/main/contextProvider';

export default function MainApp() {
  return (
    <ContextProvider>
      <div className="mainBackground">
        <div className="mainSidebar">
          <Sidebar />
        </div>

        <div className="mainContent">
          <MainContent />
        </div>
      </div>
    </ContextProvider>
  );
}
