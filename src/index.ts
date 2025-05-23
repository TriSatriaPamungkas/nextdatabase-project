import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//CREATE - Tambah User Baru
async function createUser(username: string, email: string, password: string) {
  return await prisma.user.create({
    data: {
      username,
      email,
      password,
      subs_count: 0,
      is_verified: false,
    },
  });
}

// 2. READ - Dapatkan Semua Video dengan Pemilik
async function getAllVideos() {
  return await prisma.video.findMany({
    include: {
      user: true,
    },
  });
}

// 3. READ - Dapatkan Komentar untuk Video Tertentu
async function getVideoComments(videoId: number) {
  return await prisma.commentary.findMany({
    where: {
      video_id: videoId,
    },
    include: {
      user: true,
      video: true,
    },
  });
}

// 4. UPDATE - Perbarui Jumlah View Video
async function incrementVideoViews(videoId: number) {
  return await prisma.video.update({
    where: {
      video_id: videoId,
    },
    data: {
      view_count: {
        increment: 1,
      },
    },
  });
}

// 5. DELETE - Hapus Komentar
async function deleteComment(commentId: number) {
  return await prisma.commentary.delete({
    where: {
      comment_id: commentId,
    },
  });
}

async function main() {
  // CREATE
  const newUser = await createUser("john_doe", "john@example.com", "secure123");
  console.log("User created:", newUser);
  // READ
  const videos = await getAllVideos();
  console.log("All videos:", videos);
  const videoComments = await getVideoComments(1);
  console.log("Comments for video 1:", videoComments);
  // UPDATE
  const updatedVideo = await incrementVideoViews(1);
  console.log("Video views updated:", updatedVideo);
  // DELETE
  const deletedComment = await deleteComment(5);
  console.log("Comment deleted:", deletedComment);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
