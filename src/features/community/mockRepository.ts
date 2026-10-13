import {
  CommunityPost,
  PostComment,
  ContentReport,
  GetPostsOptions,
  PostAuthor,
  ReportStatus,
} from "./types";
import {
  CreatePostInput,
  UpdatePostInput,
  CreateCommentInput,
  CreateReportInput,
} from "./schemas";
import { CommunityRepository } from "./repository";

// Baseline Authors
export const MOCK_AUTHORS: Record<string, PostAuthor> = {
  expert_rahuri: {
    id: "00000000-0000-0000-0000-000000000010",
    full_name: "डॉ. संजय देशमुख (Dr. Sanjay Deshmukh)",
    district: "अहमदनगर (Ahmednagar)",
    taluka: "राहुरी",
    role: "expert",
    is_verified_expert: true,
  },
  expert_akola: {
    id: "00000000-0000-0000-0000-000000000011",
    full_name: "प्रा. सुरेश चव्हाण (Prof. Suresh Chavan)",
    district: "अकोला (Akola)",
    taluka: "अकोला",
    role: "expert",
    is_verified_expert: true,
  },
  farmer_ramesh: {
    id: "00000000-0000-0000-0000-000000000020",
    full_name: "रमेश पाटील (Ramesh Patil)",
    district: "नाशिक (Nashik)",
    taluka: "निफाड",
    role: "farmer",
    is_verified_expert: false,
  },
  farmer_sopan: {
    id: "00000000-0000-0000-0000-000000000021",
    full_name: "सोपान पाटील (Sopan Patil)",
    district: "जळगाव (Jalgaon)",
    taluka: "रावेर",
    role: "farmer",
    is_verified_expert: false,
  },
  farmer_vitthal: {
    id: "00000000-0000-0000-0000-000000000022",
    full_name: "विठ्ठल जाधव (Vitthal Jadhav)",
    district: "कोल्हापूर (Kolhapur)",
    taluka: "करवीर",
    role: "farmer",
    is_verified_expert: false,
  },
  farmer_sunita: {
    id: "00000000-0000-0000-0000-000000000023",
    full_name: "सुनीता गीते (Sunita Gite)",
    district: "सातारा (Satara)",
    taluka: "कराड",
    role: "farmer",
    is_verified_expert: false,
  },
};

// Seed Posts
const INITIAL_POSTS: CommunityPost[] = [
  {
    id: "10000000-0000-0000-0000-000000000001",
    author_id: MOCK_AUTHORS.farmer_ramesh.id,
    author: MOCK_AUTHORS.farmer_ramesh,
    title: "सोयाबीनच्या पानांवर तांबूस डाग दिसत आहेत, उपाय सांगा?",
    content:
      "गेल्या दोन दिवसांतील पावसानंतर सोयाबीनच्या खालच्या पानांवर तपकिरी-तांबूस ठिपके दिसत आहेत आणि पाने पिवळी पडत आहेत. ही तांबेरा रोगाची सुरुवात आहे का? कोणती प्रतिबंधात्मक फवारणी फायदेशीर ठरेल?",
    crop_category: "सोयाबीन (Soybean)",
    topic_category: "pest_disease",
    image_urls: [
      "https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=800&q=80",
    ],
    is_pinned: true,
    is_locked: false,
    is_hidden: false,
    upvotes_count: 14,
    comments_count: 3,
    created_at: "2026-10-12T10:30:00Z",
    updated_at: "2026-10-12T10:30:00Z",
  },
  {
    id: "10000000-0000-0000-0000-000000000002",
    author_id: MOCK_AUTHORS.farmer_sopan.id,
    author: MOCK_AUTHORS.farmer_sopan,
    title: "कपाशीमध्ये गुलाबी बोंडअळी नियंत्रणासाठी कामगंध सापळे कधी लावावे?",
    content:
      "कपाशी आता ५० दिवसांची झाली असून पात्या धरणे सुरू झाले आहे. गुलाबी बोंडअळीच्या सर्वेक्षणासाठी हेक्टरी किती कामगंध सापळे (Pheromone Traps) लावावेत आणि लिंगाकर्षण ल्यूर किती दिवसांनी बदलावे?",
    crop_category: "कापूस (Cotton)",
    topic_category: "pest_disease",
    image_urls: [],
    is_pinned: false,
    is_locked: false,
    is_hidden: false,
    upvotes_count: 9,
    comments_count: 1,
    created_at: "2026-10-11T14:15:00Z",
    updated_at: "2026-10-11T14:15:00Z",
  },
  {
    id: "10000000-0000-0000-0000-000000000003",
    author_id: MOCK_AUTHORS.farmer_vitthal.id,
    author: MOCK_AUTHORS.farmer_vitthal,
    title: "उसात ठिबक सिंचनाने ४०% पाण्याची बचत आणि भरघोस उत्पादन अनुभव",
    content:
      "मित्रांनो, गेल्या वर्षी को-८६०३२ उसात इनलाईन ठिबक सिंचन बसवले. उन्हाळ्यातही पाण्याचा ताण पडला नाही आणि विद्राव्य खते थेट मुळांना दिल्याने एकरी १२ टनांनी उत्पादन वाढले. पाट पाण्यापेक्षा ठिबकचा खर्च एकाच वर्षात वसूल झाला.",
    crop_category: "ऊस (Sugarcane)",
    topic_category: "equipment",
    image_urls: [
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80",
    ],
    is_pinned: false,
    is_locked: false,
    is_hidden: false,
    upvotes_count: 22,
    comments_count: 2,
    created_at: "2026-10-10T09:00:00Z",
    updated_at: "2026-10-10T09:00:00Z",
  },
  {
    id: "10000000-0000-0000-0000-000000000004",
    author_id: MOCK_AUTHORS.farmer_ramesh.id,
    author: MOCK_AUTHORS.farmer_ramesh,
    title: "लासलगाव व नाशिक बाजार समितीत उन्हाळ कांदा आवक व दर स्थिती",
    content:
      "सध्या बाजार समितीत चांगल्या प्रतवारीच्या सुपर कांद्याला सरासरी १५०० ते १८०० रुपये प्रति क्विंटल भाव मिळत आहे. चाळीतील कांद्याची नियमित तपासणी करूनच टप्प्याटप्प्याने माल बाजारात आणावा, घाई करू नये.",
    crop_category: "कांदा (Onion)",
    topic_category: "market_price",
    image_urls: [],
    is_pinned: false,
    is_locked: false,
    is_hidden: false,
    upvotes_count: 17,
    comments_count: 0,
    created_at: "2026-10-09T16:45:00Z",
    updated_at: "2026-10-09T16:45:00Z",
  },
  {
    id: "10000000-0000-0000-0000-000000000005",
    author_id: MOCK_AUTHORS.farmer_sunita.id,
    author: MOCK_AUTHORS.farmer_sunita,
    title: "भातावर व भाज्यांवर सेंद्रिय जीवामृताचा वापर — मातीतील गांडूळ संख्या वाढली",
    content:
      "देशी गायीचे शेण, गोमूत्र, गूळ, डाळीचे पीठ आणि शेतातील मातीपासून तयार केलेले जीवामृत दर १५ दिवसांनी सिंचनातून दिले. पिकांची पाने चमकदार हिरवी झाली आणि रासायनिक खतांवरील खर्चात ३०% बचत झाली.",
    crop_category: "सेंद्रिय शेती (Organic)",
    topic_category: "organic",
    image_urls: [],
    is_pinned: false,
    is_locked: false,
    is_hidden: false,
    upvotes_count: 28,
    comments_count: 1,
    created_at: "2026-10-08T11:20:00Z",
    updated_at: "2026-10-08T11:20:00Z",
  },
];

// Seed Comments
const INITIAL_COMMENTS: PostComment[] = [
  {
    id: "20000000-0000-0000-0000-000000000001",
    post_id: "10000000-0000-0000-0000-000000000001",
    author_id: MOCK_AUTHORS.expert_rahuri.id,
    author: MOCK_AUTHORS.expert_rahuri,
    content:
      "हा सोयाबीनवरील तांबेरा (Rust) असू शकतो. ढगाळ व दमट हवेत याचा प्रादुर्भाव वेगाने वाढतो. तातडीने प्रोपिकोनेझोल (२५% ईसी) १ मिली प्रति लिटर पाण्यात मिसळून फवारणी करावी. शेतात साचलेले पाणी त्वरित बाहेर काढावे.",
    is_expert_answer: true,
    is_accepted_answer: true,
    is_hidden: false,
    created_at: "2026-10-12T11:15:00Z",
  },
  {
    id: "20000000-0000-0000-0000-000000000002",
    post_id: "10000000-0000-0000-0000-000000000001",
    parent_comment_id: "20000000-0000-0000-0000-000000000001",
    author_id: MOCK_AUTHORS.farmer_ramesh.id,
    author: MOCK_AUTHORS.farmer_ramesh,
    content: "धन्यवाद डॉक्टर साहेब! आजच सकाळी फवारणी करून घेतो.",
    is_expert_answer: false,
    is_accepted_answer: false,
    is_hidden: false,
    created_at: "2026-10-12T11:45:00Z",
  },
  {
    id: "20000000-0000-0000-0000-000000000003",
    post_id: "10000000-0000-0000-0000-000000000001",
    author_id: MOCK_AUTHORS.farmer_vitthal.id,
    author: MOCK_AUTHORS.farmer_vitthal,
    content: "गेल्या वर्षी आमच्या भागातही असाच त्रास होता. वेळेवर फवारणी केल्याने नुकसान टळले.",
    is_expert_answer: false,
    is_accepted_answer: false,
    is_hidden: false,
    created_at: "2026-10-12T12:00:00Z",
  },
  {
    id: "20000000-0000-0000-0000-000000000004",
    post_id: "10000000-0000-0000-0000-000000000002",
    author_id: MOCK_AUTHORS.expert_akola.id,
    author: MOCK_AUTHORS.expert_akola,
    content:
      "पाते धरण्याच्या सुरुवातीला हेक्टरी ५ कामगंध सापळे लावावेत. ल्यूर दर २१ दिवसांनी बदलावे. सलग ३ दिवस प्रति सापळा ८ पेक्षा जास्त पतंग आढळल्यास त्वरित ईटीएल पातळीनुसार निंबोळी अर्क ५% किंवा ट्रायकोग्रामा कार्ड वापरावे.",
    is_expert_answer: true,
    is_accepted_answer: true,
    is_hidden: false,
    created_at: "2026-10-11T15:00:00Z",
  },
  {
    id: "20000000-0000-0000-0000-000000000005",
    post_id: "10000000-0000-0000-0000-000000000003",
    author_id: MOCK_AUTHORS.farmer_sopan.id,
    author: MOCK_AUTHORS.farmer_sopan,
    content: "जाधव भाऊ, ठिबकसाठी सबसिडी मिळण्यासाठी किती दिवस लागले? महाडीबीटीवर अर्ज केला होता का?",
    is_expert_answer: false,
    is_accepted_answer: false,
    is_hidden: false,
    created_at: "2026-10-10T10:15:00Z",
  },
  {
    id: "20000000-0000-0000-0000-000000000006",
    post_id: "10000000-0000-0000-0000-000000000003",
    parent_comment_id: "20000000-0000-0000-0000-000000000005",
    author_id: MOCK_AUTHORS.farmer_vitthal.id,
    author: MOCK_AUTHORS.farmer_vitthal,
    content: "होय सोपानराव, महाडीबीटीवर सोडत लागल्यानंतर कृषी सहाय्यकांनी पूर्वसंमती दिली आणि एका महिन्यात अनुदान जमा झाले.",
    is_expert_answer: false,
    is_accepted_answer: false,
    is_hidden: false,
    created_at: "2026-10-10T11:00:00Z",
  },
  {
    id: "20000000-0000-0000-0000-000000000007",
    post_id: "10000000-0000-0000-0000-000000000005",
    author_id: MOCK_AUTHORS.expert_rahuri.id,
    author: MOCK_AUTHORS.expert_rahuri,
    content: "उत्कृष्ट प्रयोग! जीवामृतामुळे सूक्ष्मजीवांची वाढ होते आणि पिकांची मुळे खोलवर जाऊन अन्नद्रव्ये शोषून घेतात.",
    is_expert_answer: true,
    is_accepted_answer: false,
    is_hidden: false,
    created_at: "2026-10-08T12:00:00Z",
  },
];

// Seed Reports (For Admin moderation queue demo)
const INITIAL_REPORTS: ContentReport[] = [
  {
    id: "30000000-0000-0000-0000-000000000001",
    reporter_id: MOCK_AUTHORS.farmer_ramesh.id,
    reporter_name: "रमेश पाटील",
    post_id: "10000000-0000-0000-0000-000000000004",
    post_title: "लासलगाव व नाशिक बाजार समितीत उन्हाळ कांदा आवक व दर स्थिती",
    target_content: "कांदा भाव संदर्भात दिशाभूल करणारी माहिती",
    reason: "misinformation",
    details: "बाजार समितीतील अधिकृत भावापेक्षा वेगळे दर नमूद केले असल्याचा संशय.",
    status: "pending",
    created_at: "2026-10-13T08:30:00Z",
  },
];

class MockCommunityRepositoryImpl implements CommunityRepository {
  private posts: CommunityPost[] = JSON.parse(JSON.stringify(INITIAL_POSTS));
  private comments: PostComment[] = JSON.parse(JSON.stringify(INITIAL_COMMENTS));
  private likes: Set<string> = new Set();
  private bookmarks: Set<string> = new Set();
  private reports: ContentReport[] = JSON.parse(JSON.stringify(INITIAL_REPORTS));

  public resetToDefaults() {
    this.posts = JSON.parse(JSON.stringify(INITIAL_POSTS));
    this.comments = JSON.parse(JSON.stringify(INITIAL_COMMENTS));
    this.likes.clear();
    this.bookmarks.clear();
    this.reports = JSON.parse(JSON.stringify(INITIAL_REPORTS));
  }

  async getPosts(options: GetPostsOptions): Promise<{ posts: CommunityPost[]; total: number }> {
    let result = this.posts.filter((p) => !p.is_hidden);

    if (options.topic && options.topic !== "all") {
      result = result.filter((p) => p.topic_category === options.topic);
    }

    if (options.search && options.search.trim().length > 0) {
      const q = options.search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          (p.crop_category && p.crop_category.toLowerCase().includes(q)) ||
          p.author.full_name.toLowerCase().includes(q)
      );
    }

    if (options.onlyBookmarked && options.userId) {
      result = result.filter((p) => this.bookmarks.has(`${options.userId}:${p.id}`));
    }

    if (options.authorId) {
      result = result.filter((p) => p.author_id === options.authorId);
    }

    // Sort pinned posts first, then newest
    result.sort((a, b) => {
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    const mapped = result.map((p) => ({
      ...p,
      is_liked: options.userId ? this.likes.has(`${options.userId}:${p.id}`) : false,
      is_bookmarked: options.userId ? this.bookmarks.has(`${options.userId}:${p.id}`) : false,
    }));

    return {
      posts: mapped,
      total: mapped.length,
    };
  }

  async getPostById(id: string, currentUserId?: string): Promise<CommunityPost | null> {
    const post = this.posts.find((p) => p.id === id);
    if (!post) return null;

    return {
      ...post,
      is_liked: currentUserId ? this.likes.has(`${currentUserId}:${post.id}`) : false,
      is_bookmarked: currentUserId ? this.bookmarks.has(`${currentUserId}:${post.id}`) : false,
    };
  }

  async createPost(input: CreatePostInput, author: PostAuthor): Promise<CommunityPost> {
    const newPost: CommunityPost = {
      id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      author_id: author.id,
      author,
      title: input.title,
      content: input.content,
      crop_category: input.cropCategory || null,
      topic_category: input.topicCategory,
      image_urls: input.imageUrls || [],
      is_pinned: false,
      is_locked: false,
      is_hidden: false,
      upvotes_count: 0,
      comments_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.posts.unshift(newPost);
    return newPost;
  }

  async updatePost(
    id: string,
    input: UpdatePostInput,
    userId: string,
    isAdmin = false
  ): Promise<CommunityPost> {
    const postIndex = this.posts.findIndex((p) => p.id === id);
    if (postIndex === -1) {
      throw new Error("पोस्ट सापडली नाही (Post not found)");
    }

    const post = this.posts[postIndex];
    if (post.author_id !== userId && !isAdmin) {
      throw new Error("केवळ मूळ लेखक किंवा ॲडमिन पोस्ट बदलू शकतात (Unauthorized)");
    }

    const updated: CommunityPost = {
      ...post,
      title: input.title ?? post.title,
      content: input.content ?? post.content,
      topic_category: (input.topicCategory as any) ?? post.topic_category,
      crop_category: input.cropCategory !== undefined ? input.cropCategory : post.crop_category,
      image_urls: input.imageUrls ?? post.image_urls,
      updated_at: new Date().toISOString(),
    };

    this.posts[postIndex] = updated;
    return updated;
  }

  async deletePost(id: string, userId: string, isAdmin = false): Promise<boolean> {
    const post = this.posts.find((p) => p.id === id);
    if (!post) return false;

    if (post.author_id !== userId && !isAdmin) {
      throw new Error("पोस्ट हटवण्याचा अधिकार नाही (Unauthorized)");
    }

    this.posts = this.posts.filter((p) => p.id !== id);
    this.comments = this.comments.filter((c) => c.post_id !== id);
    return true;
  }

  async toggleLike(postId: string, userId: string): Promise<{ liked: boolean; upvotesCount: number }> {
    const post = this.posts.find((p) => p.id === postId);
    if (!post) throw new Error("पोस्ट सापडली नाही");

    const key = `${userId}:${postId}`;
    const alreadyLiked = this.likes.has(key);

    if (alreadyLiked) {
      this.likes.delete(key);
      post.upvotes_count = Math.max(0, post.upvotes_count - 1);
      return { liked: false, upvotesCount: post.upvotes_count };
    } else {
      this.likes.add(key);
      post.upvotes_count += 1;
      return { liked: true, upvotesCount: post.upvotes_count };
    }
  }

  async toggleBookmark(postId: string, userId: string): Promise<{ bookmarked: boolean }> {
    const post = this.posts.find((p) => p.id === postId);
    if (!post) throw new Error("पोस्ट सापडली नाही");

    const key = `${userId}:${postId}`;
    const alreadyBookmarked = this.bookmarks.has(key);

    if (alreadyBookmarked) {
      this.bookmarks.delete(key);
      return { bookmarked: false };
    } else {
      this.bookmarks.add(key);
      return { bookmarked: true };
    }
  }

  async getComments(postId: string): Promise<PostComment[]> {
    const postComments = this.comments.filter((c) => c.post_id === postId && !c.is_hidden);

    // Build threaded hierarchy
    const rootComments: PostComment[] = [];
    const replyMap = new Map<string, PostComment[]>();

    for (const c of postComments) {
      if (c.parent_comment_id) {
        const list = replyMap.get(c.parent_comment_id) || [];
        list.push(c);
        replyMap.set(c.parent_comment_id, list);
      } else {
        rootComments.push({ ...c, replies: [] });
      }
    }

    for (const root of rootComments) {
      root.replies = replyMap.get(root.id) || [];
    }

    return rootComments;
  }

  async createComment(
    postId: string,
    input: CreateCommentInput,
    author: PostAuthor
  ): Promise<PostComment> {
    const post = this.posts.find((p) => p.id === postId);
    if (!post) throw new Error("पोस्ट सापडली नाही");
    if (post.is_locked) throw new Error("ही चर्चा बंद (Locked) करण्यात आली आहे.");

    // Validate parent comment relationship if specified
    if (input.parentCommentId && input.parentCommentId.length > 0) {
      const parent = this.comments.find(
        (c) => c.id === input.parentCommentId && c.post_id === postId
      );
      if (!parent) {
        throw new Error("अवैध मूळ प्रतिक्रिया (Invalid parent comment relationship)");
      }
    }

    const newComment: PostComment = {
      id: `comm-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      post_id: postId,
      author_id: author.id,
      author,
      parent_comment_id: input.parentCommentId || null,
      content: input.content,
      is_expert_answer: author.role === "expert" || !!author.is_verified_expert,
      is_accepted_answer: false,
      is_hidden: false,
      created_at: new Date().toISOString(),
    };

    this.comments.push(newComment);
    post.comments_count += 1;
    return newComment;
  }

  async deleteComment(commentId: string, userId: string, isAdmin = false): Promise<boolean> {
    const commentIndex = this.comments.findIndex((c) => c.id === commentId);
    if (commentIndex === -1) return false;

    const comment = this.comments[commentIndex];
    if (comment.author_id !== userId && !isAdmin) {
      throw new Error("प्रतिक्रिया हटवण्याचा अधिकार नाही (Unauthorized)");
    }

    const postId = comment.post_id;
    this.comments.splice(commentIndex, 1);

    const post = this.posts.find((p) => p.id === postId);
    if (post) {
      post.comments_count = Math.max(0, post.comments_count - 1);
    }

    return true;
  }

  async createReport(
    input: CreateReportInput,
    reporterId: string,
    reporterName = "शेतकरी"
  ): Promise<ContentReport> {
    let targetTitle: string | undefined;
    let targetContent: string | undefined;

    if (input.postId) {
      const p = this.posts.find((x) => x.id === input.postId);
      if (p) {
        targetTitle = p.title;
        targetContent = p.content;
      }
    } else if (input.commentId) {
      const c = this.comments.find((x) => x.id === input.commentId);
      if (c) {
        targetContent = c.content;
      }
    }

    const newReport: ContentReport = {
      id: `rep-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      reporter_id: reporterId,
      reporter_name: reporterName,
      post_id: input.postId || null,
      comment_id: input.commentId || null,
      post_title: targetTitle,
      target_content: targetContent,
      reason: input.reason,
      details: input.details || null,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    this.reports.unshift(newReport);
    return newReport;
  }

  async getReports(status?: ReportStatus): Promise<ContentReport[]> {
    if (status) {
      return this.reports.filter((r) => r.status === status);
    }
    return [...this.reports];
  }

  async moderateContent(
    reportId: string,
    action: "dismiss" | "hide_content" | "restore_content" | "lock_post",
    adminId: string
  ): Promise<boolean> {
    const report = this.reports.find((r) => r.id === reportId);
    if (!report) throw new Error("तक्रार सापडली नाही (Report not found)");

    report.reviewed_by = adminId;
    report.reviewed_at = new Date().toISOString();

    if (action === "dismiss") {
      report.status = "dismissed";
    } else {
      report.status = "action_taken";
      if (action === "hide_content") {
        if (report.post_id) {
          const p = this.posts.find((x) => x.id === report.post_id);
          if (p) p.is_hidden = true;
        }
        if (report.comment_id) {
          const c = this.comments.find((x) => x.id === report.comment_id);
          if (c) c.is_hidden = true;
        }
      } else if (action === "restore_content") {
        if (report.post_id) {
          const p = this.posts.find((x) => x.id === report.post_id);
          if (p) p.is_hidden = false;
        }
        if (report.comment_id) {
          const c = this.comments.find((x) => x.id === report.comment_id);
          if (c) c.is_hidden = false;
        }
      } else if (action === "lock_post" && report.post_id) {
        const p = this.posts.find((x) => x.id === report.post_id);
        if (p) p.is_locked = true;
      }
    }

    return true;
  }
}

export const mockCommunityRepository = new MockCommunityRepositoryImpl();
