import EpicsPageView from "@/components/epic/EpicsPageView";

interface EpicsPageProps {
  params: Promise<{ projectId: string }>;
}

const EpicsPage = async ({ params }: EpicsPageProps) => {
  const { projectId } = await params;

  return <EpicsPageView projectId={projectId} />;
};

export default EpicsPage;
