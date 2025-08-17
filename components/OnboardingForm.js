export default function OnboardingForm({ title, fields, onSubmit }) {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-slate mb-4">{title}</h1>
      <form onSubmit={onSubmit} className="card space-y-4">
        {fields.map((f) => (
          <div key={f.name}>
            <label className="block text-sm font-medium mb-1">{f.label}</label>
            {f.type === "textarea" ? (
              <textarea
                name={f.name}
                className="w-full border rounded-xl2 p-2"
                required={f.required}
              />
            ) : (
              <input
                type={f.type || "text"}
                name={f.name}
                className="w-full border rounded-xl2 p-2"
                required={f.required}
              />
            )}
          </div>
        ))}
        <button className="btn bg-teal text-white" type="submit">
          Continue
        </button>
      </form>
    </div>
  );
}
