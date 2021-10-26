import Header from './Header';
import Content from './Content';

import styles from './index.module.css';

const ChatPanel = () => (
  <div className={styles.panel}>
    <Header />
    <Content />
  </div>
);

export default ChatPanel;
