import React, { useState, useEffect } from 'react';
import { useCommunityStore } from './data/store';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AnnouncementBar } from './components/AnnouncementBar';
import { RoleSwitcherModal } from './components/RoleSwitcherModal';
import { CommandSearchModal } from './components/CommandSearchModal';
import { AuthModal } from './components/AuthModal';
import { CommunityAccessModal } from './components/CommunityAccessModal';
import { useAuth } from './lib/auth/AuthContext';
import { normalizeRole, hasPermission } from './lib/security';
import { UserRole } from './types';

import { CommunityAssistant } from './components/CommunityAssistant';
import { RecommendedNextStep } from './components/RecommendedNextStep';
import { generateRecommendations } from './lib/recommendations/recommendationEngine';

// Pages
import { HomePage } from './pages/HomePage';
import { ActivitiesPage } from './pages/ActivitiesPage';
import { ActivityDetailPage } from './pages/ActivityDetailPage';
import { LearnPage } from './pages/LearnPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ChallengesPage } from './pages/ChallengesPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { AboutPage } from './pages/AboutPage';
import { JoinPage } from './pages/JoinPage';
import { AdminPage } from './pages/AdminPage';
import { CoreTeamPage } from './pages/CoreTeamPage';

export function App() {
  const store = useCommunityStore();
  // Parse initial view and slug from location.hash or pathname
  const parseHashLocation = () => {
    let hash = '';
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname.replace(/^\//, '').toLowerCase();
      if (pathname === 'admin' || pathname === 'core') {
        return { view: pathname, detailId: undefined };
      }
      hash = window.location.hash.replace(/^#\/?/, '');
    }
    if (!hash || hash === 'home') {
      return { view: 'home', detailId: undefined };
    }
    if (hash.startsWith('activity/')) {
      const slug = hash.replace('activity/', '');
      return { view: 'activity_detail', detailId: slug };
    }
    if (hash.startsWith('activities/')) {
      const slug = hash.replace('activities/', '');
      return { view: 'activity_detail', detailId: slug };
    }
    if (hash.startsWith('learn/')) {
      const slug = hash.replace('learn/', '');
      return { view: 'learn', detailId: slug };
    }
    if (hash.startsWith('projects/')) {
      const slug = hash.replace('projects/', '');
      return { view: 'projects', detailId: slug };
    }
    if (hash.startsWith('challenges/')) {
      const slug = hash.replace('challenges/', '');
      return { view: 'challenges', detailId: slug };
    }
    if (hash.startsWith('resources/')) {
      const slug = hash.replace('resources/', '');
      return { view: 'resources', detailId: slug };
    }
    if (hash.startsWith('core/draft/')) {
      const draftId = hash.replace('core/draft/', '');
      return { view: 'core', detailId: draftId };
    }
    if (['activities', 'learn', 'projects', 'challenges', 'resources', 'about', 'join', 'admin', 'core'].includes(hash)) {
      return { view: hash, detailId: undefined };
    }
    return { view: 'home', detailId: undefined };
  };

  const auth = useAuth();
  const [currentView, setCurrentView] = useState<string>(() => parseHashLocation().view);
  const [selectedDetailId, setSelectedDetailId] = useState<string | undefined>(() => parseHashLocation().detailId);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalView, setAuthModalView] = useState<'LOGIN' | 'FORGOT_PASSWORD' | 'RESET_PASSWORD'>('LOGIN');
  const [isCommunityAccessModalOpen, setIsCommunityAccessModalOpen] = useState<boolean>(false);
  const [authTargetRole, setAuthTargetRole] = useState<'CORE_TEAM' | 'ADMIN' | undefined>(undefined);

  const activeUser = auth.currentUser || store.currentUser;

  const handleAuthSuccess = (role: UserRole) => {
    const norm = normalizeRole(role);
    if (norm === 'ADMIN') {
      navigateTo('admin');
    } else if (norm === 'CORE_TEAM') {
      navigateTo('core');
    }
  };

  const handleSignOutToPublic = async () => {
    await auth.logout();
    store.setCurrentRole('STUDENT');
    navigateTo('home');
  };

  // Sync hash state with navigation & check reset password hash
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash.includes('reset-password')) {
      setAuthModalView('RESET_PASSWORD');
      setIsAuthModalOpen(true);
    }
  }, []);

  const navigateTo = (view: string, detailId?: string) => {
    setCurrentView(view);
    setSelectedDetailId(detailId);

    // Record page view telemetry
    store.recordAnalyticsEvent({
      eventType: 'PAGE_VIEW',
      entityType: 'PageView',
      entityId: view,
      metadata: detailId ? { detailId } : undefined
    });

    if (typeof window !== 'undefined') {
      let targetHash = `#${view}`;
      if (view === 'activity_detail' && detailId) {
        targetHash = `#activities/${detailId}`;
      } else if (view === 'learn' && detailId) {
        targetHash = `#learn/${detailId}`;
      } else if (view === 'projects' && detailId) {
        targetHash = `#projects/${detailId}`;
      } else if (view === 'challenges' && detailId) {
        targetHash = `#challenges/${detailId}`;
      } else if (view === 'resources' && detailId) {
        targetHash = `#resources/${detailId}`;
      } else if (view === 'core' && detailId) {
        targetHash = `#core/draft/${detailId}`;
      }
      if (window.location.hash !== targetHash) {
        window.history.pushState(null, '', targetHash);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Listen to hashchange / popstate for browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== 'undefined' && window.location.hash.includes('reset-password')) {
        setAuthModalView('RESET_PASSWORD');
        setIsAuthModalOpen(true);
      }
      const { view, detailId } = parseHashLocation();
      setCurrentView(view);
      setSelectedDetailId(detailId);
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // Keyboard shortcut Ctrl+K for search and Escape to close modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsSearchModalOpen(false);
        setIsRoleModalOpen(false);
        setIsCommunityAccessModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      {/* Top Announcement Marquee */}
      <AnnouncementBar
        settings={store.settings}
        onNavigate={navigateTo}
      />

      {/* Global Glassmorphic Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={navigateTo}
        currentUser={activeUser}
        onOpenCommunityAccess={() => setIsCommunityAccessModalOpen(true)}
        onOpenSearch={() => setIsSearchModalOpen(true)}
      />

      {/* Main View Router */}
      <main style={{ flex: 1 }}>
        {currentView === 'home' && (
          <HomePage
            activities={store.activities}
            learningPaths={store.learningPaths}
            projects={store.projects}
            challenges={store.challenges}
            settings={store.settings}
            currentUser={store.currentUser}
            onNavigate={navigateTo}
          />
        )}

        {currentView === 'activities' && (
          <ActivitiesPage
            activities={store.activities}
            currentUser={store.currentUser}
            onNavigate={navigateTo}
          />
        )}

        {currentView === 'activity_detail' && (
          <ActivityDetailPage
            slug={selectedDetailId || store.activities[0]?.slug}
            activities={store.activities}
            currentUser={store.currentUser}
            onNavigate={navigateTo}
          />
        )}

        {currentView === 'learn' && (
          <div className="container" style={{ paddingTop: '2rem' }}>
            <RecommendedNextStep
              recommendation={generateRecommendations(store.completedModuleIds, store.analyticsEvents, {
                activities: store.activities,
                learningPaths: store.learningPaths,
                projects: store.projects,
                challenges: store.challenges,
                resources: store.resources
              }).continueLearning}
              onNavigate={navigateTo}
            />
            <LearnPage
              learningPaths={store.learningPaths}
              selectedModuleSlug={selectedDetailId}
              completedModuleIds={store.completedModuleIds}
              onToggleModuleCompletion={store.toggleModuleCompletion}
              onNavigate={navigateTo}
            />
          </div>
        )}

        {currentView === 'projects' && (
          <ProjectsPage
            projects={store.projects}
            selectedProjectSlug={selectedDetailId}
            currentUser={store.currentUser}
            onSaveProject={store.saveProject}
            onUpvoteProject={store.upvoteProject}
            onNavigate={navigateTo}
          />
        )}

        {currentView === 'challenges' && (
          <ChallengesPage
            challenges={store.challenges}
            selectedChallengeSlug={selectedDetailId}
            currentUser={store.currentUser}
            onSaveChallenge={store.saveChallenge}
            onNavigate={navigateTo}
          />
        )}

        {currentView === 'resources' && (
          <ResourcesPage
            resources={store.resources}
            selectedCategorySlug={selectedDetailId}
            currentUser={store.currentUser}
            onSaveResource={store.saveResource}
            onIncrementDownloads={store.incrementResourceDownloads}
            onNavigate={navigateTo}
          />
        )}

        {currentView === 'about' && (
          <AboutPage
            leadership={store.leadership}
            settings={store.settings}
            onNavigate={navigateTo}
          />
        )}

        {currentView === 'join' && (
          <JoinPage
            settings={store.settings}
            onNavigate={navigateTo}
          />
        )}

        {currentView === 'admin' && (
          normalizeRole(activeUser.role) === 'ADMIN' ? (
            <AdminPage
              activities={store.activities}
              learningPaths={store.learningPaths}
              projects={store.projects}
              challenges={store.challenges}
              resources={store.resources}
              leadership={store.leadership}
              activityDrafts={store.activityDrafts}
              users={store.users}
              analyticsEvents={store.analyticsEvents}
              completedModuleIds={store.completedModuleIds}
              settings={store.settings}
              currentUser={activeUser}
              onSaveActivity={store.saveActivity}
              onDeleteActivity={store.deleteActivity}
              onSaveProject={store.saveProject}
              onDeleteProject={store.deleteProject}
              onSaveChallenge={store.saveChallenge}
              onDeleteChallenge={store.deleteChallenge}
              onSaveResource={store.saveResource}
              onDeleteResource={store.deleteResource}
              onSaveLeadership={store.saveLeadership}
              onDeleteLeadership={store.deleteLeadership}
              onSaveLearningPath={store.saveLearningPath}
              onDeleteLearningPath={store.deleteLearningPath}
              onSaveStatistic={store.saveStatistic}
              onDeleteStatistic={store.deleteStatistic}
              onSaveAnnouncement={store.saveAnnouncement}
              onDeleteAnnouncement={store.deleteAnnouncement}
              onSaveTimelineMilestone={store.saveTimelineMilestone}
              onDeleteTimelineMilestone={store.deleteTimelineMilestone}
              onReviewDraft={store.reviewActivityDraft}
              onPublishDraft={store.publishActivityDraft}
              onUpdateUserRole={store.updateUserRole}
              onUpdateUserStatus={store.updateUserStatus}
              onUpdateSettings={store.updateSettings}
              onResetData={store.resetToDefaultData}
              onExportJson={store.exportDatabaseJson}
              onImportJson={store.importDatabaseJson}
              onNavigate={navigateTo}
            />
          ) : (
            <div className="container" style={{ paddingTop: '5rem', paddingBottom: '6rem', textAlign: 'center' }}>
              <div className="glass-panel" style={{ padding: '3.5rem 2rem', maxWidth: '560px', margin: '0 auto', border: '1px solid var(--border-glow)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🛡️</div>
                <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem', color: '#FFF' }}>Access Restricted — Administrator Only</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                  The Admin CMS workspace requires verified <strong>ADMIN</strong> credentials. Public visitors and students do not have administrative access.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                  <button 
                    onClick={() => { 
                      setAuthTargetRole('ADMIN'); 
                      setAuthModalView('LOGIN'); 
                      setIsAuthModalOpen(true); 
                    }} 
                    className="btn btn-primary btn-sm"
                  >
                    Administrator Sign In
                  </button>
                  <button onClick={() => navigateTo('home')} className="btn btn-secondary btn-sm">
                    Return to Public Home
                  </button>
                </div>
              </div>
            </div>
          )
        )}

        {currentView === 'core' && (
          hasPermission(activeUser.role, 'CORE_TEAM') ? (
            <CoreTeamPage
              activities={store.activities}
              projects={store.projects}
              activityDrafts={store.activityDrafts}
              selectedDraftId={selectedDetailId}
              currentUser={activeUser}
              onSaveActivity={store.saveActivity}
              onSaveProject={store.saveProject}
              onSaveDraft={store.saveActivityDraft}
              onDeleteDraft={store.deleteActivityDraft}
              onSubmitDraft={store.submitActivityDraft}
              onNavigate={navigateTo}
            />
          ) : (
            <div className="container" style={{ paddingTop: '5rem', paddingBottom: '6rem', textAlign: 'center' }}>
              <div className="glass-panel" style={{ padding: '3.5rem 2rem', maxWidth: '560px', margin: '0 auto', border: '1px solid var(--border-glow)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🔒</div>
                <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem', color: '#FFF' }}>Access Restricted — Core Member Only</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                  The Core Team Operational Workspace is reserved for active community coordinators and technical leads.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                  <button 
                    onClick={() => { 
                      setAuthTargetRole('CORE_TEAM'); 
                      setAuthModalView('LOGIN'); 
                      setIsAuthModalOpen(true); 
                    }} 
                    className="btn btn-primary btn-sm"
                  >
                    Core Member Sign In
                  </button>
                  <button onClick={() => navigateTo('home')} className="btn btn-secondary btn-sm">
                    Return to Public Home
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </main>

      {/* Global Footer */}
      <Footer
        settings={store.settings}
        onNavigate={navigateTo}
      />

      {/* Global Role Switcher Modal (Internal Utility) */}
      <RoleSwitcherModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        currentUser={activeUser}
        onSelectRole={(role) => store.setCurrentRole(role)}
      />

      {/* Community Internal Access Gateway (Triggered by Logo) */}
      <CommunityAccessModal
        isOpen={isCommunityAccessModalOpen}
        onClose={() => setIsCommunityAccessModalOpen(false)}
        currentUser={activeUser}
        onSelectCoreMember={() => {
          setIsCommunityAccessModalOpen(false);
          setAuthTargetRole('CORE_TEAM');
          setAuthModalView('LOGIN');
          setIsAuthModalOpen(true);
        }}
        onSelectAdministrator={() => {
          setIsCommunityAccessModalOpen(false);
          setAuthTargetRole('ADMIN');
          setAuthModalView('LOGIN');
          setIsAuthModalOpen(true);
        }}
        onSignOutToPublic={handleSignOutToPublic}
        onNavigate={navigateTo}
      />

      {/* Production Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setAuthTargetRole(undefined);
        }}
        initialView={authModalView}
        targetRole={authTargetRole}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Global Search & Command Modal */}
      <CommandSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        activities={store.activities}
        learningPaths={store.learningPaths}
        projects={store.projects}
        challenges={store.challenges}
        resources={store.resources}
        onNavigate={navigateTo}
        onRecordAnalytics={store.recordAnalyticsEvent}
      />

      {/* Student AI Community Assistant (Read-Only Local Knowledge Mode) */}
      <CommunityAssistant
        activities={store.activities}
        learningPaths={store.learningPaths}
        projects={store.projects}
        challenges={store.challenges}
        resources={store.resources}
        onNavigate={navigateTo}
        onRecordAnalytics={store.recordAnalyticsEvent}
      />
    </div>
  );
}
export default App;
