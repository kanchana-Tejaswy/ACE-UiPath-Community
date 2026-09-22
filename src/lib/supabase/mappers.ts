import { 
  Activity, 
  ProjectShowcase, 
  CommunityResource, 
  LearningPath, 
  Challenge, 
  LeadershipMember, 
  SiteSettings, 
  ActivityDraft,
  Article
} from '../../types';
import { normalizeBannerAspectRatio } from '../../utils/bannerRatio';
import { 
  DatabaseActivityRow, 
  DatabaseProjectRow, 
  DatabaseResourceRow, 
  DatabaseLearningPathRow, 
  DatabaseChallengeRow, 
  DatabaseLeadershipRow, 
  DatabaseActivityDraftRow,
  DatabaseArticleRow
} from './types';

// Activities
export function mapActivityRowToEntity(row: DatabaseActivityRow): Activity {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category as any,
    eventType: row.event_type as any,
    date: row.activity_date,
    timeStart: row.time_start,
    timeEnd: row.time_end,
    venue: row.venue,
    summary: row.summary,
    fullDescriptionMd: row.full_description_md,
    objectives: row.objectives_text || [],
    agenda: row.agenda || [],
    uipathTopicsCovered: row.uipath_topics || [],
    learningOutcomes: row.learning_outcomes || [],
    bannerImage: row.banner_image_url,
    galleryImages: row.gallery_images && row.gallery_images.length > 0 ? row.gallery_images : [row.banner_image_url],
    recordingUrl: row.recording_url,
    slidesUrl: row.slides_url,
    githubUrl: row.github_url,
    workflowPackageUrl: row.workflow_package_url,
    status: row.status as any,
    isFeatured: Boolean(row.is_featured),
    speakers: row.speakers || [],
    achievements: row.achievements || [],
    createdAt: row.created_at
  };
}

export function mapActivityEntityToRow(act: Activity): DatabaseActivityRow {
  return {
    id: act.id,
    slug: act.slug,
    title: act.title,
    category: act.category,
    event_type: act.eventType,
    activity_date: act.date,
    time_start: act.timeStart,
    time_end: act.timeEnd,
    venue: act.venue,
    summary: act.summary,
    full_description_md: act.fullDescriptionMd,
    objectives_text: act.objectives,
    agenda: act.agenda,
    uipath_topics: act.uipathTopicsCovered,
    learning_outcomes: act.learningOutcomes,
    banner_image_url: act.bannerImage,
    gallery_images: act.galleryImages,
    recording_url: act.recordingUrl,
    slides_url: act.slidesUrl,
    github_url: act.githubUrl,
    workflow_package_url: act.workflowPackageUrl,
    status: act.status,
    is_featured: act.isFeatured,
    speakers: act.speakers,
    achievements: act.achievements,
    updated_at: new Date().toISOString()
  };
}

// Projects
export function mapProjectRowToEntity(row: DatabaseProjectRow): ProjectShowcase {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    tagline: row.tagline,
    summary: row.summary,
    problemStatement: row.problem_statement,
    solutionDescription: row.solution_description,
    uipathToolsUsed: row.uipath_tools_used || [],
    roiMetrics: row.roi_metrics,
    repoUrl: row.repo_url,
    packageDownloadUrl: row.package_download_url,
    videoDemoUrl: row.video_demo_url,
    previewImages: row.preview_images && row.preview_images.length > 0 ? row.preview_images : ['https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'],
    authorName: row.author_name,
    authorRollNumber: row.author_roll_number,
    authorBranch: row.author_branch,
    authorAvatar: row.author_avatar,
    authorLinkedin: row.author_linkedin,
    status: row.status,
    downloadCount: row.download_count || 0,
    upvotes: row.upvotes || 0,
    createdAt: row.created_at || new Date().toISOString()
  };
}

export function mapProjectEntityToRow(proj: ProjectShowcase): DatabaseProjectRow {
  return {
    id: proj.id,
    slug: proj.slug,
    title: proj.title,
    tagline: proj.tagline,
    summary: proj.summary,
    problem_statement: proj.problemStatement,
    solution_description: proj.solutionDescription,
    uipath_tools_used: proj.uipathToolsUsed,
    roi_metrics: proj.roiMetrics,
    repo_url: proj.repoUrl,
    package_download_url: proj.packageDownloadUrl,
    video_demo_url: proj.videoDemoUrl,
    preview_images: proj.previewImages,
    author_name: proj.authorName,
    author_roll_number: proj.authorRollNumber,
    author_branch: proj.authorBranch,
    author_avatar: proj.authorAvatar,
    author_linkedin: proj.authorLinkedin,
    status: proj.status,
    download_count: proj.downloadCount,
    upvotes: proj.upvotes,
    created_at: proj.createdAt
  };
}

// Resources
export function mapResourceRowToEntity(row: DatabaseResourceRow): CommunityResource {
  return {
    id: row.id,
    title: row.title,
    category: row.category as any,
    description: row.description,
    uipathVersion: row.uipath_version,
    downloadUrl: row.download_url,
    fileType: row.file_type as any,
    tags: row.tags || [],
    downloadCount: row.download_count || 0,
    createdAt: row.created_at
  };
}

export function mapResourceEntityToRow(res: CommunityResource): DatabaseResourceRow {
  return {
    id: res.id,
    title: res.title,
    category: res.category,
    description: res.description,
    uipath_version: res.uipathVersion,
    download_url: res.downloadUrl,
    file_type: res.fileType,
    tags: res.tags,
    download_count: res.downloadCount,
    created_at: res.createdAt || new Date().toISOString()
  };
}

// Learning Paths
export function mapLearningPathRowToEntity(row: DatabaseLearningPathRow): LearningPath {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    tagline: row.tagline,
    level: row.level as any,
    targetAudience: row.target_audience,
    estimatedHours: row.estimated_hours,
    iconName: row.icon_name,
    description: row.description,
    orderIndex: row.order_index,
    isPublished: row.is_published,
    modules: row.modules || []
  };
}

export function mapLearningPathEntityToRow(path: LearningPath): DatabaseLearningPathRow {
  const numericHours = typeof path.estimatedHours === 'number'
    ? path.estimatedHours
    : parseInt(String(path.estimatedHours || '32').replace(/\D/g, ''), 10) || 32;

  return {
    id: path.id,
    slug: path.slug,
    title: path.title,
    tagline: path.tagline,
    level: path.level,
    target_audience: path.targetAudience,
    estimated_hours: numericHours,
    icon_name: path.iconName,
    description: path.description,
    order_index: path.orderIndex || 1,
    is_published: path.isPublished !== false,
    modules: path.modules || []
  };
}

// Challenges
export function mapChallengeRowToEntity(row: DatabaseChallengeRow): Challenge {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    theme: row.theme,
    category: row.category as any,
    status: (row.status as any) || 'Active',
    startDate: row.start_date,
    endDate: row.end_date,
    startTime: row.start_time,
    endTime: row.end_time,
    registrationDeadline: row.registration_deadline,
    registrationDeadlineTime: row.registration_deadline_time,
    registrationUrl: row.registration_url,
    communityChannelUrl: row.community_channel_url,
    bannerImage: row.banner_image_url,
    isFeatured: Boolean(row.is_featured),
    prizePool: row.prize_pool,
    descriptionMd: row.description_md,
    rulesMd: row.rules_md,
    evaluationCriteria: row.evaluation_criteria || [],
    starterDatasetUrl: row.starter_dataset_url,
    submissionCount: row.submission_count || 0,
    recordings: row.recordings || [],
    useCases: row.use_cases || [],
    referenceMaterials: row.reference_materials || [],
    winners: row.winners || []
  };
}

export function mapChallengeEntityToRow(chal: Challenge): DatabaseChallengeRow {
  return {
    id: chal.id,
    slug: chal.slug,
    title: chal.title,
    theme: chal.theme,
    category: chal.category,
    status: chal.status,
    start_date: chal.startDate,
    end_date: chal.endDate,
    start_time: chal.startTime,
    end_time: chal.endTime,
    registration_deadline: chal.registrationDeadline,
    registration_deadline_time: chal.registrationDeadlineTime,
    registration_url: chal.registrationUrl,
    community_channel_url: chal.communityChannelUrl,
    banner_image_url: chal.bannerImage,
    is_featured: chal.isFeatured,
    prize_pool: chal.prizePool,
    description_md: chal.descriptionMd,
    rules_md: chal.rulesMd,
    evaluation_criteria: chal.evaluationCriteria,
    starter_dataset_url: chal.starterDatasetUrl,
    submission_count: chal.submissionCount,
    recordings: chal.recordings,
    use_cases: chal.useCases,
    reference_materials: chal.referenceMaterials,
    winners: chal.winners
  };
}

// Leadership
export function mapLeadershipRowToEntity(row: DatabaseLeadershipRow): LeadershipMember {
  const parts = row.academic_year?.includes('-') ? row.academic_year.split('-').map((s) => s.trim()) : [];
  const derivedStart = parts[0] || undefined;
  const derivedEnd = parts[1] || undefined;
  const isAlumniCategory = row.category === 'Alumni' || row.category === 'Alumni Mentor';

  const categories = Array.isArray(row.roster_categories) && row.roster_categories.length > 0
    ? (row.roster_categories as any[])
    : [row.category || 'Core Team Member'];

  return {
    id: row.id,
    name: row.name,
    roleTitle: row.role_title,
    category: (categories[0] || row.category || 'Core Team Member') as any,
    rosterCategories: categories as any,
    academicYear: row.academic_year,
    avatarUrl: row.avatar_url,
    startYear: row.start_year || derivedStart,
    endYear: row.end_year || (derivedEnd === 'Present' ? undefined : derivedEnd),
    isActive: row.is_active !== undefined ? row.is_active : !isAlumniCategory,
    department: row.department,
    linkedinUrl: row.linkedin_url,
    githubUrl: row.github_url,
    uipathProfileUrl: row.uipath_profile_url,
    bio: row.bio,
    contributions: row.contributions || [],
    orderIndex: row.order_index
  };
}

export function mapLeadershipEntityToRow(lead: LeadershipMember): DatabaseLeadershipRow {
  // Format standardized tenure string for academic_year
  const computedTenure = lead.startYear
    ? `${lead.startYear} - ${lead.isActive !== false ? 'Present' : (lead.endYear || 'Past')}`
    : (lead.academicYear || '2024 - Present');

  const categories = Array.isArray(lead.rosterCategories) && lead.rosterCategories.length > 0
    ? lead.rosterCategories
    : [lead.category || 'Core Team Member'];

  return {
    id: lead.id,
    name: lead.name,
    role_title: lead.roleTitle,
    category: String(categories[0] || lead.category || 'Core Team Member'),
    roster_categories: categories.map(String),
    academic_year: computedTenure,
    avatar_url: lead.avatarUrl,
    start_year: lead.startYear !== undefined ? String(lead.startYear) : undefined,
    end_year: lead.endYear !== undefined ? String(lead.endYear) : undefined,
    is_active: lead.isActive !== false,
    department: lead.department,
    linkedin_url: lead.linkedinUrl,
    github_url: lead.githubUrl,
    uipath_profile_url: lead.uipathProfileUrl,
    bio: lead.bio,
    contributions: lead.contributions || [],
    order_index: lead.orderIndex
  };
}

// Activity Drafts
export function mapActivityDraftRowToEntity(row: DatabaseActivityDraftRow): ActivityDraft {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category as any,
    eventType: row.event_type as any,
    date: row.activity_date,
    timeStart: row.time_start,
    timeEnd: row.time_end,
    venue: row.venue,
    summary: row.summary,
    fullDescriptionMd: row.full_description_md || '',
    objectives: row.objectives || [],
    agenda: row.agenda || [],
    uipathTopicsCovered: row.uipath_topics_covered || [],
    learningOutcomes: row.learning_outcomes || [],
    bannerImage: row.banner_image || '',
    galleryImages: row.gallery_images || [],
    recordingUrl: row.recording_url,
    slidesUrl: row.slides_url,
    githubUrl: row.github_url,
    workflowPackageUrl: row.workflow_package_url,
    speakers: row.speakers || [],
    achievements: row.achievements || [],
    status: row.status as any,
    isFeatured: Boolean(row.is_featured),
    createdBy: row.created_by,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
    submittedAt: row.submitted_at,
    reviewedAt: row.reviewed_at,
    reviewNotes: row.review_notes,
    completionPercentage: row.completion_percentage || 50
  };
}

export function mapActivityDraftEntityToRow(draft: ActivityDraft): DatabaseActivityDraftRow {
  return {
    id: draft.id,
    slug: draft.slug,
    title: draft.title,
    category: draft.category,
    event_type: draft.eventType,
    activity_date: draft.date,
    time_start: draft.timeStart,
    time_end: draft.timeEnd,
    venue: draft.venue,
    summary: draft.summary,
    full_description_md: draft.fullDescriptionMd,
    objectives: draft.objectives,
    agenda: draft.agenda,
    uipath_topics_covered: draft.uipathTopicsCovered,
    learning_outcomes: draft.learningOutcomes,
    banner_image: draft.bannerImage,
    gallery_images: draft.galleryImages,
    recording_url: draft.recordingUrl,
    slides_url: draft.slidesUrl,
    github_url: draft.githubUrl,
    workflow_package_url: draft.workflowPackageUrl,
    speakers: draft.speakers,
    achievements: draft.achievements,
    status: draft.status,
    is_featured: draft.isFeatured,
    created_by: draft.createdBy,
    created_at: draft.createdAt,
    updated_at: draft.updatedAt,
    submitted_at: draft.submittedAt,
    reviewed_at: draft.reviewedAt,
    review_notes: draft.reviewNotes,
    completion_percentage: draft.completionPercentage
  };
}

// Articles & Technical Write-ups
export function mapArticleRowToEntity(row: DatabaseArticleRow): Article {
  const normalizedRatio = normalizeBannerAspectRatio(row.aspect_ratio);
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    coverImage: row.cover_image,
    coverImageUrl: row.cover_image,
    aspectRatio: normalizedRatio,
    coverBanner: {
      url: row.cover_image,
      aspectRatio: normalizedRatio
    },
    category: row.category as any,
    authorName: row.author_name,
    authorRole: row.author_role,
    status: row.status as any,
    scheduledAt: row.scheduled_at,
    publishedAt: row.published_at,
    isFeatured: Boolean(row.is_featured),
    views: row.views || 0,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
    createdBy: row.created_by,
    updatedBy: row.updated_by
  };
}

export function mapArticleEntityToRow(article: Article): DatabaseArticleRow {
  const ratio = normalizeBannerAspectRatio(article.coverBanner?.aspectRatio || article.aspectRatio);
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
    cover_image: article.coverBanner?.url || article.coverImageUrl || article.coverImage,
    aspect_ratio: ratio,
    category: article.category,
    author_name: article.authorName,
    author_role: article.authorRole,
    status: article.status,
    scheduled_at: article.scheduledAt,
    published_at: article.publishedAt,
    is_featured: article.isFeatured,
    views: article.views || 0,
    created_at: article.createdAt,
    updated_at: article.updatedAt,
    created_by: article.createdBy,
    updated_by: article.updatedBy
  };
}

