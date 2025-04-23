// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { NodeSDK } from "@opentelemetry/sdk-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { Resource } from "@opentelemetry/resources";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-proto";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { BatchLogRecordProcessor } from "@opentelemetry/sdk-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";

// For troubleshooting, set the log level to DiagLogLevel.DEBUG
//import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
//diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const sdk = new NodeSDK({
  resource: new Resource({
    [ATTR_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME,
  }) as any,
  logRecordProcessors: [
    new BatchLogRecordProcessor(new OTLPLogExporter() as any),
  ],
  instrumentations: [getNodeAutoInstrumentations()],
  spanProcessors: [
    new BatchSpanProcessor(new OTLPTraceExporter() as any) as any,
  ],
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter() as any,
  }) as any,
});

sdk.start();
