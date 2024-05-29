import { ConfigProvider } from "antd";
import { observer } from "mobx-react-lite";
import { gstate } from "./global";
import { ContextAction } from "./ContextAction";
import { Analytics } from "@vercel/analytics/react";
import { Loading } from "./components/Loading";

export const App = observer(() => {
  return (
    <ConfigProvider
      locale={gstate.locale?.antLocale}
      theme={{
        token: {
          colorPrimary: "#1B86C8",
          colorLink: "#1B86C8",
          colorSuccess: "#1B86C8",
        },
      }}
    >
      <ContextAction />
      {import.meta.env.MODE === "production" && <Analytics />}
      {gstate.page}
      {gstate.loading && <Loading />}
    </ConfigProvider>
  );
});
