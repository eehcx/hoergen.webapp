import { createFileRoute } from "@tanstack/react-router";
import { Helmet } from "react-helmet-async";
import Subscriptions from "@/features/subscriptions";

export const Route = createFileRoute('/_authenticated/subscriptions/')({
  component: SubscriptionsPage,
});

function SubscriptionsPage() {
  return (
    <>
      <Helmet>
        <title>Subscriptions - Manage Your Hörgen Plans</title>
        <meta
          name="description"
          content="Manage your Hörgen subscriptions, billing, and access premium features that amplify your underground radio experience."
        />
      </Helmet>
      <Subscriptions />
    </>
  );
}

export { default as SubscriptionSuccess } from "./success";
export { default as SubscriptionCancel } from "./cancel";