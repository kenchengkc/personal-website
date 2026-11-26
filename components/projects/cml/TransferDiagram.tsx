import styles from "./transfer-diagram.module.css";

export function TransferDiagram({ model }: { model: "Llama" | "Qwen" }) {
  const source = model === "Llama";

  return <table className={styles.config} aria-label={source ? "Proposed Llama training configuration" : "Proposed Qwen transfer configuration"}>
    <thead>
      <tr>
        <th scope="col">Parameter</th>
        <th scope="col">{model} <span className={styles.role}>· {source ? "source" : "target"}</span></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">Layer compression</th>
        <td><abbr title="Principal component analysis">PCA</abbr> × {source ? 32 : 36} layers</td>
      </tr>
      <tr>
        <th scope="row">Train {model} adapter</th>
        <td><code className={styles.trainable}>True</code></td>
      </tr>
      <tr>
        <th scope="row">Train shared classifier</th>
        <td><code key={model} className={`${styles.changed} ${source ? styles.trainable : styles.fixed}`}>{source ? "True" : "False"}</code></td>
      </tr>
      <tr>
        <th scope="row">Evaluate on</th>
        <td>New scenarios</td>
      </tr>
    </tbody>
  </table>;
}
