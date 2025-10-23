import { createMessagesPage } from "@/components/messages/messages-page-factory";

export default createMessagesPage({
  role: "employer",
  basePath: "/employer/messages",
  emptyState: {
    title: "You haven’t started any conversations yet.",
    description: "Create a contract with a freelancer to unlock real-time messaging.",
    cta: {
      href: "/employer/jobs",
      label: "Review job postings",
    },
  },
});
