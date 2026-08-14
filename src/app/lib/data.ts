export const skills = [
  {
    title: "Frontend",
    items: [
      { name: "React/Next.js", value: 95 },
      { name: "Tailwind CSS", value: 90 },
      { name: "TypeScript", value: 88 },
    ],
  },
  {
    title: "Backend",
    items: [
      { name: "Node/Express", value: 92 },
      { name: "Python/Django", value: 88 },
      { name: "PostgreSQL / Supabase", value: 85 },
    ],
  },
  {
    title: "AI / ML",
    items: [
      { name: "Computer Vision", value: 90 },
      { name: "PyTorch / OpenCV", value: 88 },
      { name: "DL / NLP", value: 85 },
    ],
  },
  {
    title: "Mobile & DevOps",
    items: [
      { name: "React Native / Flutter", value: 85 },
      { name: "Docker / CI/CD", value: 80 },
      { name: "Cloud (Vercel/Firebase)", value: 88 },
    ],
  },
];

export const timeline: { q: string; title: string; desc: string }[] = [];

export const services = [
  {
    title: "AI & Machine Learning Solutions",
    body: "Pengembangan sistem berbasis kecerdasan buatan untuk otomatisasi proses, analisis data prediktif, pembuatan model ML kustom, serta integrasi modern AI API (LLM/RAG) untuk alur kerja yang cerdas.",
    iconName: "Brain"
  },
  {
    title: "Computer Vision Systems",
    body: "Aplikasi pengolahan citra dan video digital real-time seperti deteksi objek, klasifikasi gambar, pengenalan wajah, dan analisis spasial menggunakan Python, OpenCV, PyTorch, dan CUDA.",
    iconName: "Eye"
  },
  {
    title: "Full-Stack Web Development",
    body: "Rancang bangun aplikasi web modern berkinerja tinggi, responsif, cepat, dan scalable yang mencakup arsitektur frontend dinamis serta infrastruktur backend dan database yang kuat.",
    iconName: "Code2"
  },
  {
    title: "Mobile App Development",
    body: "Pengembangan aplikasi seluler Android & iOS berkinerja tinggi dengan UI/UX intuitif, responsif, dan terhubung dengan backend cloud.",
    iconName: "Smartphone"
  }
];

export const founderAchievements = [
  {
    image: "/images/hakisertifikat.jpeg",
    title: "Copyright Registration for Computer Vision-Based Prayer Movement Detection System",
    issuer: "Directorate General of Intellectual Property",
    year: "April 2026",
    description: "Successfully obtained an official copyright registration for the software project titled \"Sistem Deteksi Gerakan Sholat Yang Melebihi Batas Rakaatnya Berbasis Computer Vision.\" This project utilizes computer vision technology to analyze and monitor prayer movements, demonstrating practical implementation of image processing and intelligent monitoring systems.",
  },
  {
    image: "/images/courserasertifikat.jpeg",
    title: "Introduction to Computer Vision",
    issuer: "University of Colorado Boulder via Coursera",
    year: "2026",
    description: "Completed a comprehensive course covering the fundamentals of Computer Vision, including image processing, feature detection, object recognition, image classification, and practical computer vision applications. Developed an understanding of how computers interpret visual information and apply computer vision techniques to solve real-world problems.",
  },
  {
    image: "/images/komdigisertifikat.jpeg",
    title: "Prompt Engineering with Azure OpenAI Service",
    issuer: "Komdigi & Microsoft",
    year: "June 2025",
    description: "Completed training on Prompt Engineering using Azure OpenAI Service through the Digital Talent Scholarship Program. Learned best practices for designing effective prompts, optimizing AI-generated responses, and leveraging generative AI technologies for real-world applications and business solutions.",
  },
];

export const founderCertificates: { image: string; title: string; issuer?: string; year?: string; credentialId?: string; status?: string }[] = [];

export const clients: string[] = [];
