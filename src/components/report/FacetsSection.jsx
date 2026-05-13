import { useState } from 'react';
import { ChevronDown, ChevronUp, Layers } from 'lucide-react';
import { dimensions, dimensionOrder } from '../../data/dimensions';

function FacetBar({ name, score }) {
  const toneColor =
    score >= 70 ? 'bg-forest' : score >= 40 ? 'bg-petrol' : 'bg-oxblood';
  const toneText =
    score >= 70 ? 'text-forest' : score >= 40 ? 'text-petrol' : 'text-oxblood';
  return (
    <div className="py-2.5">
      <div className="flex items-baseline justify-between mb-1.5 gap-3">
        <span className="text-[13px] text-ink">{name}</span>
        <span className={`num text-[13px] font-medium ${toneText}`} dir="ltr">
          {score}
        </span>
      </div>
      <div className="relative h-1.5 bg-paper-dark border border-ink-line/60">
        <div
          className={`absolute top-0 right-0 h-full ${toneColor} transition-all duration-700 ease-out`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function DimensionFacetCard({ dimensionKey, facets, expanded, onToggle }) {
  const meta = dimensions[dimensionKey];
  // Sort facets by id (N1, N2, ...) ascending
  const sortedFacets = [...facets].sort((a, b) => a.id.localeCompare(b.id));

  return (
    <article className={`bg-paper-light border ${meta.classes.borderSoft} border-r-[4px] ${meta.classes.border}`}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-right p-5 flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className={`num text-[11px] tracking-widish uppercase ${meta.classes.bgGhost} ${meta.classes.text} ${meta.classes.borderSoft} border px-1.5 py-0.5 font-semibold`}>
            {meta.key}
          </span>
          <h3 className={`display text-[18px] ${meta.classes.text}`}>{meta.name}</h3>
          <span className="text-[12px] text-ink-mute">{sortedFacets.length} תת-מימדים</span>
        </div>
        {expanded ? <ChevronUp size={18} className="text-ink-soft" /> : <ChevronDown size={18} className="text-ink-soft" />}
      </button>

      {expanded && (
        <div className="border-t border-ink-line/60 px-5 pb-5">
          {sortedFacets.map((f) => (
            <FacetBar key={f.id} name={f.name} score={f.normalized} />
          ))}
        </div>
      )}
    </article>
  );
}

export default function FacetsSection({ facets }) {
  const [openDims, setOpenDims] = useState(new Set(dimensionOrder));

  // Group facets by their dimension (S because N is flipped)
  const grouped = {};
  Object.entries(facets || {}).forEach(([facetId, f]) => {
    const dim = f.dimension;
    if (!grouped[dim]) grouped[dim] = [];
    grouped[dim].push({ id: facetId, ...f });
  });

  const toggle = (dim) => {
    setOpenDims((prev) => {
      const next = new Set(prev);
      if (next.has(dim)) next.delete(dim);
      else next.add(dim);
      return next;
    });
  };

  if (!facets || Object.keys(facets).length === 0) return null;

  return (
    <section className="mb-12">
      <header className="flex items-baseline gap-4 mb-3">
        <Layers size={18} className="text-plum shrink-0" />
        <h2 className="display text-2xl text-ink">תת-מימדים (30 facets)</h2>
        <div className="flex-1 rule h-px" />
        <button
          type="button"
          onClick={() => {
            if (openDims.size === dimensionOrder.length) setOpenDims(new Set());
            else setOpenDims(new Set(dimensionOrder));
          }}
          className="text-[11px] tracking-widish uppercase text-petrol hover:underline-petrol font-medium"
        >
          {openDims.size === dimensionOrder.length ? 'סגרי הכל' : 'פתחי הכל'}
        </button>
      </header>
      <p className="text-[13px] text-ink-mute mb-5 max-w-2xl leading-relaxed">
        כל אחד מ-5 הממדים מתפרק ל-6 תת-מימדים. רמת פירוט זו זמינה רק בשאלון המעמיק (IPIP-NEO-120, Johnson 2014).
      </p>

      <div className="space-y-3">
        {dimensionOrder.map((d) => {
          const dimFacets = grouped[d];
          if (!dimFacets || dimFacets.length === 0) return null;
          return (
            <DimensionFacetCard
              key={d}
              dimensionKey={d}
              facets={dimFacets}
              expanded={openDims.has(d)}
              onToggle={() => toggle(d)}
            />
          );
        })}
      </div>
    </section>
  );
}
