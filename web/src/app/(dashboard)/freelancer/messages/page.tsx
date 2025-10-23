import { createMessagesPage } from "@/components/messages/messages-page-factory";

export default createMessagesPage({
  role: "freelancer",
  basePath: "/freelancer/messages",
  emptyState: {
    title: "No conversations yet.",
    description: "Once a client hires you, the contract workspace chat will appear here.",
    cta: {
      href: "/freelancer/jobs",
      label: "Browse jobs",
    },
  },
});
