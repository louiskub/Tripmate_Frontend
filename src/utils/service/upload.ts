export async function uploadBlobUrls(blobUrls: string[]) {
  const formData = new FormData()

  // แปลงแต่ละ blob URL เป็น Blob จริง
  for (const blobUrl of blobUrls) {
    const res = await fetch(blobUrl) // ดึงข้อมูล binary จาก browser memory
    const blob = await res.blob()

    // ตั้งชื่อไฟล์ (ไม่จำเป็นแต่ควรให้ backend ใช้ได้)
    const filename = `${crypto.randomUUID()}.jpg`

    // แปลงเป็น File แล้วแนบใน FormData
    const file = new File([blob], filename, { type: blob.type })
    formData.append("profileImg", file)
  }
  return formData
}