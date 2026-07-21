export function Video({ url }: { url: string }) {
  return (
    <div style={{ margin: "0 auto", width: "100%" }}>
      <video className="w-full h-auto" autoPlay muted loop playsInline>
        <source src={url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
