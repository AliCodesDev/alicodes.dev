import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <article className="space-y-8">
      <h1 className="text-3xl font-semibold tracking-tight">About</h1>
      <div className="prose">
        <p>
          I am a software engineer who builds LLM applications. My focus is
          human–AI interaction: agents that carry out multi-step work inside real
          systems, and the retrieval, Python backends, integrations, and
          evaluation behind them.
        </p>
        <p>
          I came up through electrical and computer engineering at the American
          University of Beirut, then a master&rsquo;s at Universitat Pompeu Fabra
          in Barcelona, where I worked in a research lab on context-aware agents
          over institutional knowledge bases. Since then I have built and shipped
          products for clients around the world, and spent five months as
          founding engineer on a regulated healthcare product in Paris.
        </p>
        <p>
          I come from an engineering background, so I care about rigour — but I
          have always worked across disciplines, and that is where I do my best
          thinking.
        </p>
        <p>
          Based in Beirut. Reachable at{" "}
          <a href="mailto:ali@alicodes.dev">ali@alicodes.dev</a>.
        </p>
      </div>
    </article>
  );
}
