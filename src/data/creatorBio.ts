export interface CreatorProfile {
  name: string;
  creativeAliases: string[];
  roles: string[];
  tagline: string;
  creatorOf: string;
  email: string;
  website: string;
  coreAxiom: string;
  manifestoLines: string[];
  bioParagraphs: string[];
  technicalPillars: {
    title: string;
    description: string;
  }[];
  publishedWorks: {
    title: string;
    subtitle?: string;
    genre: string;
    description: string;
  }[];
  focusThemes: string[];
}

export const KENNETH_CRIPPS_BIO: CreatorProfile = {
  name: "Kenneth Cripps",
  creativeAliases: ["Ken X Cripps", "Flamewalker"],
  roles: [
    "Creator of Guardian Oracle",
    "Author",
    "Artist",
    "Independent Technologist",
    "Architect of Q-Mesh"
  ],
  tagline: "Sovereign AI • Decentralized Systems • Cyberpunk • Occult & Symbolic Art",
  creatorOf: "Guardian Oracle",
  email: "Kenx@guardianoracle.com",
  website: "https://guardianoracle.com/",
  coreAxiom: "Knowledge can propagate. Privilege cannot. Compute can migrate. State remains sovereign.",
  manifestoLines: [
    "His work moves between code and myth.",
    "Guardian Oracle is where those paths converge.",
    "Part software system, part research project, part creative laboratory."
  ],
  bioParagraphs: [
    "Kenneth Cripps, also known creatively as Ken X Cripps and Flamewalker, is an independent author, artist, technologist, and the creator of Guardian Oracle—an experimental sovereign AI project exploring the intersection of artificial intelligence, human agency, memory, identity, decentralized systems, and symbolic practice.",
    "His work moves between code and myth.",
    "As the architect of Guardian Oracle and its developing Q-Mesh architecture, Cripps explores resilient AI systems designed around a simple principle: Knowledge can propagate. Privilege cannot. Compute can migrate. State remains sovereign.",
    "His technical work investigates sovereign and decentralized artificial intelligence, persistent agent memory, local and edge inference, zero-trust distributed compute, cryptographic identity, verifiable execution, and architectures in which AI models and compute providers remain replaceable while identity and canonical state remain under the user’s control.",
    "His creative work approaches many of the same questions through another language: fiction, occult symbolism, cyberpunk, ritual art, and myth.",
    "Cripps is the author of Lucifera’s Walk, Lucifera’s Walk: Cyberpunk Edition, LIBER IGNIS, and Starting Over at Fifty, alongside an expanding body of independent books, visual works, and experimental texts.",
    "Across these different forms runs a common thread: transformation, sovereignty, survival, remembrance, and the possibility of rebuilding oneself—and one’s tools—outside inherited structures.",
    "Guardian Oracle is where those paths converge.",
    "It is part software system, part research project, part creative laboratory: an ongoing attempt to explore what personal AI might become when memory, identity, agency, and computation belong first to the individual rather than the platform."
  ],
  technicalPillars: [
    {
      title: "Sovereign & Decentralized AI",
      description: "Architectures where AI models and compute providers remain replaceable utilities while identity, keys, and canonical state remain exclusively under the user's sovereign control."
    },
    {
      title: "Persistent Agent Memory & State",
      description: "Locally anchored contextual graphs and verifiable recall, preventing platform-level vendor lock-in or centralized corporate censorship of cognitive history."
    },
    {
      title: "Local & Edge Inference",
      description: "Distributed local compute topologies running zero-trust inference on user-owned hardware without external telemetry exfiltration."
    },
    {
      title: "Zero-Trust Distributed Compute",
      description: "Decoupled computation fabrics operating under zero implicit trust, where execution is cryptographically verified rather than corporately assumed."
    },
    {
      title: "Cryptographic Identity & Verifiable Execution",
      description: "Asymmetric cryptographic attestation guaranteeing that patient and operator custody cannot be seized, altered, or impersonated."
    },
    {
      title: "Q-Mesh Resilient Topology",
      description: "Resilient peer-to-peer routing and state synchronization designed around sovereign propagation principles."
    }
  ],
  publishedWorks: [
    {
      title: "Lucifera’s Walk",
      genre: "Fiction / Occult Symbolism",
      description: "An evocative narrative exploring ritual, transformation, memory, and personal sovereignty."
    },
    {
      title: "Lucifera’s Walk: Cyberpunk Edition",
      genre: "Cyberpunk / Speculative Fiction",
      description: "A dark neon mythos reimagining occult and symbolic rituals within decentralized high-tech machinery."
    },
    {
      title: "LIBER IGNIS",
      genre: "Occult & Symbolic Art / Experimental Text",
      description: "An esoteric treatise exploring internal alchemy, the sacred flame, and survival outside inherited dogma."
    },
    {
      title: "Starting Over at Fifty",
      genre: "Memoir / Transformative Non-Fiction",
      description: "A profound, grounded account of personal resurrection, rebuilding life, and mastering autonomous agency from first principles."
    }
  ],
  focusThemes: [
    "Sovereign AI",
    "Decentralized Systems",
    "Persistent Agent Memory",
    "Q-Mesh Architecture",
    "Cyberpunk Aesthetics",
    "Occult & Symbolic Art",
    "Verifiable Execution",
    "Zero-Trust Compute",
    "Human Agency & Myth"
  ]
};
