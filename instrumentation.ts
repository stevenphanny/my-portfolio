import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { BatchLogRecordProcessor, LoggerProvider } from "@opentelemetry/sdk-logs";

function getPostHogLogConfig() {
  const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!token || !host) {
    if (process.env.NODE_ENV !== "production") {
      const missingVariable = token
        ? "NEXT_PUBLIC_POSTHOG_HOST"
        : "NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN";
      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      );
    }

    return null;
  }

  return { host, token };
}

const posthogLogConfig = getPostHogLogConfig();

export const loggerProvider = posthogLogConfig
  ? new LoggerProvider({
      resource: resourceFromAttributes({ "service.name": "my-portfolio" }),
      processors: [
        new BatchLogRecordProcessor({
          exporter: new OTLPLogExporter({
            url: `${posthogLogConfig.host.replace(/\/$/, "")}/i/v1/logs`,
            headers: {
              Authorization: `Bearer ${posthogLogConfig.token}`,
              "Content-Type": "application/json",
            },
          }),
        }),
      ],
    })
  : null;

export function register() {
  // The provider is intentionally not global, so existing application loggers stay local.
}
