export const skills = [
  {
    title: "Frontend",
    items: [
      { name: "React/Next.js", value: 95 },
      { name: "Tailwind CSS", value: 90 },
    ],
  },
  {
    title: "Backend",
    items: [
      { name: "Node/Express", value: 92 },
      { name: "Python/Django", value: 88 },
    ],
  },
  {
    title: "AI / ML",
    items: [
      { name: "Computer Vision", value: 90 },
      { name: "DL / NLP", value: 85 },
    ],
  },
  {
    title: "Database",
    items: [
      { name: "PostgreSQL", value: 85 },
      { name: "MongoDB", value: 80 },
    ],
  },
];

// Projects are managed via Admin Dashboard → Firestore. This empty array is kept for backward compatibility.
export const projects: { name: string; category: string; desc: string; tech: string[]; image?: string }[] = [];

export const timeline = [
  {
    q: "2025  Present",
    title: "Awal Perjalanan SOFTVISION",
    desc: "SOFTVISION berawal dari eksplorasi teknologi modern, pengembangan berbagai proyek perangkat lunak, serta pembelajaran berkelanjutan di bidang Web Development, Mobile Development, Artificial Intelligence, dan Computer Vision sebagai fondasi membangun solusi digital yang bernilai.",
  },
];

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
];

export const founderStats = [
  { n: "45+", l: "projects" },
  { n: "12", l: "tech stacks" },
  { n: "15", l: "certifications" },
  { n: "30+", l: "clients" },
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
    issuer: "Komdigi & Microsoft",
    year: "June 2025",
    title: "Prompt Engineering with Azure OpenAI Service",
    description: "Completed training on Prompt Engineering using Azure OpenAI Service through the Digital Talent Scholarship Program. Learned best practices for designing effective prompts, optimizing AI-generated responses, and leveraging generative AI technologies for real-world applications and business solutions.",
  },
];

export const founderCertificates = [
  {
    image: "/images/courserasertifikat.jpeg",
    title: "TensorFlow Developer",
    issuer: "Google / Coursera",
    year: "2023",
    credentialId: "TF-DEV-XYZ",
    status: "Issued",
  },
  {
    image: "/images/komdigisertifikat.jpeg",
    title: "Advanced MLOps",
    issuer: "Google / DeepLearning.AI",
    year: "2024",
    credentialId: "MLOPS-2024",
    status: "Issued",
  },
];

export const clients = [
  "Aero-Tech Systems",
  "Silicon Peak Lab",
  "Cloud 9 Systems",
  "Alpha AI Ltd",
  "Beta Dev Corp",
  "Vertex Dynamics",
  "Quantum Labs",
  "Horizon Tech",
  "Nexus Software",
  "Nova Ventures",
  "Cyber Security Partners",
  "Data Flow Corp",
  "Apex Industrial",
  "Pioneer Systems",
  "Future Enterprise",
];
