import fs from "fs";
import path from "path";
import React from "react";
import { Document, Page, StyleSheet, Text, pdf } from "@react-pdf/renderer";

const inputPath = path.resolve(process.cwd(), "docs", "arquitetura.md");
const outputPath = path.resolve(process.cwd(), "docs", "arquitetura.pdf");

const md = fs.readFileSync(inputPath, "utf-8");
const lines = md
  .replace(/\r\n/g, "\n")
  .split("\n")
  .map((line) => line.replace(/\t/g, "  "));

const styles = StyleSheet.create({
  page: {
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 30,
    fontSize: 10,
    lineHeight: 1.35,
  },
  line: {
    marginBottom: 3,
  },
});

function MdDoc() {
  return React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: "A4", style: styles.page },
      ...lines.map((line, i) =>
        React.createElement(Text, { key: i, style: styles.line }, line.length === 0 ? " " : line)
      )
    )
  );
}

async function main() {
  const instance = pdf(React.createElement(MdDoc));
  const stream = await instance.toBuffer();
  await new Promise<void>((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    stream.on("error", reject);
    output.on("error", reject);
    output.on("finish", resolve);
    stream.pipe(output);
  });
  console.log(`PDF gerado em: ${outputPath}`);
}

main().catch((error) => {
  console.error("Falha ao gerar PDF:", error);
  process.exit(1);
});
