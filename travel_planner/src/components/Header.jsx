import './Header.css'
import UserProfile from './UserProfile'

function Header({ onUserChange }) {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-left">
          <h1 className="project-title">
            <span className="title-icon">✈️</span>
            <span className="title-text">WanderSync</span>
          </h1>
          <p className="project-tagline">Plan. Sync. Explore.</p>
        </div>
        <div className="header-right">
          <UserProfile onUserChange={onUserChange} />
        </div>
      </div>
    </header>
  )
}

export default Header

