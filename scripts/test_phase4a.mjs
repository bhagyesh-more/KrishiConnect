import { readFileSync } from "fs";
import { z } from "zod";

const AllowedTopics = [
  "crop_care",
  "pest_disease",
  "market_price",
  "equipment",
  "organic",
  "general",
];

const AllowedReportReasons = [
  "misinformation",
  "unsafe_pesticide_advice",
  "spam",
  "abuse",
  "other",
];

const createPostSchema = z.object({
  title: z.string().min(5).max(150),
  content: z.string().min(10).max(3000),
  topicCategory: z.enum(AllowedTopics),
  cropCategory: z.string().max(50).optional(),
  imageUrls: z.array(z.string()).max(3).default([]),
});

const createCommentSchema = z.object({
  content: z.string().min(2).max(1000),
  parentCommentId: z.string().uuid().optional().or(z.literal("")),
});

const createReportSchema = z.object({
  postId: z.string().uuid().optional().or(z.literal("")),
  commentId: z.string().uuid().optional().or(z.literal("")),
  reason: z.enum(AllowedReportReasons),
  details: z.string().max(500).optional(),
});

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  PASS: ${message}`);
  } else {
    failed++;
    console.error(`  FAIL: ${message}`);
  }
}

console.log("=== Running Milestone 4A (Farmer Community) Tests ===");

// 1. Post Schema Tests
console.log("\n1. Testing createPostSchema:");
const validPost = createPostSchema.safeParse({
  title: "सोयाबीन कीड नियंत्रण उपाय काय आहेत?",
  content: "माझ्या शेतात खोडमाशीचा प्रादुर्भाव दिसत आहे, कृपया योग्य फवारणी सुचवा.",
  topicCategory: "pest_disease",
  cropCategory: "सोयाबीन",
  imageUrls: ["https://example.com/photo1.jpg"],
});
assert(validPost.success, "Valid community post input succeeds");

const invalidShortTitle = createPostSchema.safeParse({
  title: "कीड",
  content: "माझ्या शेतात खोडमाशीचा प्रादुर्भाव दिसत आहे.",
  topicCategory: "pest_disease",
});
assert(!invalidShortTitle.success, "Short title (< 5 chars) rejected");

const invalidShortContent = createPostSchema.safeParse({
  title: "सोयाबीन कीड नियंत्रण उपाय",
  content: "सांगा",
  topicCategory: "pest_disease",
});
assert(!invalidShortContent.success, "Short content (< 10 chars) rejected");

const invalidTopic = createPostSchema.safeParse({
  title: "सोयाबीन कीड नियंत्रण उपाय",
  content: "माझ्या शेतात खोडमाशीचा प्रादुर्भाव दिसत आहे.",
  topicCategory: "invalid_topic",
});
assert(!invalidTopic.success, "Invalid topic category rejected");

const invalidTooManyImages = createPostSchema.safeParse({
  title: "सोयाबीन कीड नियंत्रण उपाय",
  content: "माझ्या शेतात खोडमाशीचा प्रादुर्भाव दिसत आहे.",
  topicCategory: "pest_disease",
  imageUrls: ["url1", "url2", "url3", "url4"],
});
assert(!invalidTooManyImages.success, "More than 3 images rejected");

// 2. Comment Schema Tests
console.log("\n2. Testing createCommentSchema:");
const validComment = createCommentSchema.safeParse({
  content: "प्रोपिकोनेझोल १ मिली प्रति लिटर पाण्यात मिसळून फवारणी करा.",
});
assert(validComment.success, "Valid comment input succeeds");

const validReply = createCommentSchema.safeParse({
  content: "धन्यवाद डॉक्टर साहेब!",
  parentCommentId: "20000000-0000-4000-a000-000000000001",
});
assert(validReply.success, "Valid threaded reply with parentCommentId succeeds");

const invalidShortComment = createCommentSchema.safeParse({
  content: "a",
});
assert(!invalidShortComment.success, "Comment under 2 chars rejected");

// 3. Report Schema Tests
console.log("\n3. Testing createReportSchema:");
const validReport = createReportSchema.safeParse({
  postId: "10000000-0000-4000-a000-000000000001",
  reason: "unsafe_pesticide_advice",
  details: "अपप्रमाणित रसायनाचा घातक सल्ला दिला आहे.",
});
assert(validReport.success, "Valid content report input succeeds");

const invalidReportReason = createReportSchema.safeParse({
  postId: "10000000-0000-4000-a000-000000000001",
  reason: "invalid_reason",
});
assert(!invalidReportReason.success, "Invalid report reason rejected");

// 4. In-Memory Mock Repository Workflows
console.log("\n4. Testing Mock Community Repository Workflows:");

class TestCommunityRepo {
  constructor() {
    this.posts = [];
    this.comments = [];
    this.likes = new Set();
    this.bookmarks = new Set();
    this.reports = [];
  }

  async createPost(input, author) {
    const post = {
      id: "post-1",
      author_id: author.id,
      author,
      ...input,
      is_pinned: false,
      is_hidden: false,
      upvotes_count: 0,
      comments_count: 0,
      created_at: new Date().toISOString(),
    };
    this.posts.unshift(post);
    return post;
  }

  async updatePost(id, input, userId, isAdmin = false) {
    const post = this.posts.find((p) => p.id === id);
    if (!post) throw new Error("Not found");
    if (post.author_id !== userId && !isAdmin) throw new Error("Unauthorized");
    Object.assign(post, input);
    return post;
  }

  async deletePost(id, userId, isAdmin = false) {
    const post = this.posts.find((p) => p.id === id);
    if (!post) return false;
    if (post.author_id !== userId && !isAdmin) throw new Error("Unauthorized");
    this.posts = this.posts.filter((p) => p.id !== id);
    return true;
  }

  async toggleLike(postId, userId) {
    const key = `${userId}:${postId}`;
    const post = this.posts.find((p) => p.id === postId);
    if (this.likes.has(key)) {
      this.likes.delete(key);
      post.upvotes_count = Math.max(0, post.upvotes_count - 1);
      return { liked: false, upvotesCount: post.upvotes_count };
    } else {
      this.likes.add(key);
      post.upvotes_count += 1;
      return { liked: true, upvotesCount: post.upvotes_count };
    }
  }

  async toggleBookmark(postId, userId) {
    const key = `${userId}:${postId}`;
    if (this.bookmarks.has(key)) {
      this.bookmarks.delete(key);
      return { bookmarked: false };
    } else {
      this.bookmarks.add(key);
      return { bookmarked: true };
    }
  }

  async createComment(postId, input, author) {
    const comment = {
      id: `comm-${this.comments.length + 1}`,
      post_id: postId,
      author_id: author.id,
      author,
      ...input,
      is_expert_answer: author.role === "expert",
      created_at: new Date().toISOString(),
    };
    this.comments.push(comment);
    const post = this.posts.find((p) => p.id === postId);
    if (post) post.comments_count += 1;
    return comment;
  }

  async getComments(postId) {
    const list = this.comments.filter((c) => c.post_id === postId);
    const roots = [];
    const replyMap = new Map();
    for (const c of list) {
      if (c.parentCommentId) {
        const arr = replyMap.get(c.parentCommentId) || [];
        arr.push(c);
        replyMap.set(c.parentCommentId, arr);
      } else {
        roots.push({ ...c, replies: [] });
      }
    }
    for (const r of roots) {
      r.replies = replyMap.get(r.id) || [];
    }
    return roots;
  }

  async createReport(input, reporterId) {
    const report = {
      id: "rep-1",
      reporter_id: reporterId,
      ...input,
      status: "pending",
      created_at: new Date().toISOString(),
    };
    this.reports.push(report);
    return report;
  }

  async moderateContent(reportId, action) {
    const report = this.reports.find((r) => r.id === reportId);
    if (!report) throw new Error("Report not found");
    if (action === "hide_content") {
      report.status = "action_taken";
      const post = this.posts.find((p) => p.id === report.postId);
      if (post) post.is_hidden = true;
    }
    return true;
  }
}

async function runRepoTests() {
  const repo = new TestCommunityRepo();
  const authorA = { id: "user-1", full_name: "रमेश पाटील", district: "नाशिक", role: "farmer" };
  const authorB = { id: "user-2", full_name: "डॉ. संजय देशमुख", district: "राहुरी", role: "expert" };

  // 4.1 Create Post
  const newPost = await repo.createPost(
    {
      title: "सोयाबीन कीड नियंत्रण उपाय",
      content: "माझ्या शेतात खोडमाशीचा प्रादुर्भाव दिसत आहे.",
      topicCategory: "pest_disease",
      cropCategory: "सोयाबीन",
      imageUrls: [],
    },
    authorA
  );
  assert(newPost.id === "post-1", "Post created successfully");

  // 4.2 Ownership on Update
  const updated = await repo.updatePost(newPost.id, { title: "सोयाबीन कीड नियंत्रण उपाय व सल्ला" }, authorA.id);
  assert(updated.title.includes("सल्ला"), "Author can update own post");

  let unauthorizedUpdate = false;
  try {
    await repo.updatePost(newPost.id, { title: "Hacked" }, authorB.id, false);
  } catch {
    unauthorizedUpdate = true;
  }
  assert(unauthorizedUpdate, "Non-author update is rejected with unauthorized error");

  // 4.3 Likes & Bookmarks
  const like1 = await repo.toggleLike(newPost.id, authorB.id);
  assert(like1.liked === true && like1.upvotesCount === 1, "Like toggles ON and increments count");

  const like2 = await repo.toggleLike(newPost.id, authorB.id);
  assert(like2.liked === false && like2.upvotesCount === 0, "Second Like toggles OFF and decrements count");

  const bm1 = await repo.toggleBookmark(newPost.id, authorB.id);
  assert(bm1.bookmarked === true, "Bookmark toggles ON");

  const bm2 = await repo.toggleBookmark(newPost.id, authorB.id);
  assert(bm2.bookmarked === false, "Bookmark toggles OFF");

  // 4.4 Comments & Threaded replies
  const comment = await repo.createComment(newPost.id, { content: "प्रोपिकोनेझोल वापरा." }, authorB);
  assert(comment.is_expert_answer === true, "Verified expert role flagged on expert response");

  const reply = await repo.createComment(newPost.id, { content: "धन्यवाद!", parentCommentId: comment.id }, authorA);
  assert(reply.parentCommentId === comment.id, "Nested reply linked to parent comment");

  const thread = await repo.getComments(newPost.id);
  assert(thread[0].replies.length === 1, "Thread correctly nested with parent and reply");

  // 4.5 Report & Moderation
  const report = await repo.createReport({ postId: newPost.id, reason: "spam" }, authorB.id);
  assert(report.status === "pending", "Content report submitted with pending status");

  await repo.moderateContent(report.id, "hide_content");
  assert(report.status === "action_taken", "Moderation marks status action_taken");
  assert(newPost.is_hidden === true, "Reported post hidden after moderation action");

  // 4.6 Post Deletion
  const deleted = await repo.deletePost(newPost.id, authorA.id);
  assert(deleted === true, "Author can delete own post");
}

await runRepoTests();

// 5. Migration 003 SQL Integrity
console.log("\n5. Testing 003_community.sql migration integrity:");
const migrationSql = readFileSync("supabase/migrations/003_community.sql", "utf8");
assert(migrationSql.includes("CREATE TABLE IF NOT EXISTS public.community_posts"), "Table community_posts created IF NOT EXISTS");
assert(migrationSql.includes("CREATE TABLE IF NOT EXISTS public.post_comments"), "Table post_comments created IF NOT EXISTS");
assert(migrationSql.includes("CREATE TABLE IF NOT EXISTS public.post_reactions"), "Table post_reactions created IF NOT EXISTS");
assert(migrationSql.includes("CREATE TABLE IF NOT EXISTS public.post_bookmarks"), "Table post_bookmarks created IF NOT EXISTS");
assert(migrationSql.includes("CREATE TABLE IF NOT EXISTS public.post_reports"), "Table post_reports created IF NOT EXISTS");
assert(migrationSql.includes("ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY"), "RLS enabled on community_posts");
assert(migrationSql.includes("ALTER TABLE public.post_reports ENABLE ROW LEVEL SECURITY"), "RLS enabled on post_reports");
assert(migrationSql.includes("CREATE TRIGGER trg_sync_post_upvotes"), "Upvote counter trigger present");
assert(migrationSql.includes("CREATE TRIGGER trg_sync_post_comments"), "Comments counter trigger present");

console.log(`\nResults: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  process.exit(1);
}
