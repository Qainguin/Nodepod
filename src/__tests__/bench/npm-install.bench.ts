import { describe, bench, expect } from "vitest";
import { MemoryVolume } from "../../memory-volume";
import { DependencyInstaller } from "../../packages/installer";

const INSTALL_BENCHMARK_OPTIONS = {
  iterations: 1,
  warmupIterations: 0,
  time: 0,
  warmupTime: 0,
};

function createInstallVolume(dependencies: Record<string, string>) {
  const vol = new MemoryVolume();
  vol.mkdirSync("/project", { recursive: true });
  vol.writeFileSync(
    "/project/package.json",
    JSON.stringify(
      {
        name: "nodepod-install-bench",
        private: true,
        dependencies,
      },
      null,
      2,
    ) + "\n",
  );
  return vol;
}

describe("NPM install", () => {
  bench(
    "cold install: @mariozechner/pi-coding-agent",
    async () => {
      const vol = createInstallVolume({
        "@mariozechner/pi-coding-agent": "latest",
      });
      const installer = new DependencyInstaller(vol, { cwd: "/project" });

      const result = await installer.installFromManifest(undefined, {
        transformModules: false,
      });

      expect(result.resolved.has("@mariozechner/pi-coding-agent")).toBe(true);
      expect(
        vol.existsSync(
          "/project/node_modules/@mariozechner/pi-coding-agent/package.json",
        ),
      ).toBe(true);
    },
    INSTALL_BENCHMARK_OPTIONS,
  );
});
