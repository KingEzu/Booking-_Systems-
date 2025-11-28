import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";
import Title from "./Title";

export default function AddUpcoming() {
  const { axios, getToken } = useAppContext();

  const backdropRef = useRef(null);
  const trailerRef = useRef(null);
  const castFileRefs = useRef({});

  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [language, setLanguage] = useState("");
  const [runtime, setRuntime] = useState("");
  const [genreInput, setGenreInput] = useState("");
  const [genresArray, setGenresArray] = useState([]);

  const [backdropFile, setBackdropFile] = useState(null);
  const [backdropPreview, setBackdropPreview] = useState(null);

  const [trailerFile, setTrailerFile] = useState(null);
  const [trailerPreview, setTrailerPreview] = useState(null);

  const [casts, setCasts] = useState([{ name: "", file: null, previewUrl: null }]);

  useEffect(() => {
    return () => {
      if (backdropPreview) URL.revokeObjectURL(backdropPreview);
      if (trailerPreview) URL.revokeObjectURL(trailerPreview);
      casts.forEach((c) => c.previewUrl && URL.revokeObjectURL(c.previewUrl));
    };
  }, [backdropPreview, trailerPreview, casts]);

  const handleGenreParse = () => {
    const arr = genreInput.split(",").map((g) => g.trim()).filter(Boolean);
    setGenresArray(arr);
  };

  const onBackdropChange = (e) => {
    const file = e.target.files?.[0] || null;
    setBackdropFile(file);
    setBackdropPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return file ? URL.createObjectURL(file) : null;
    });
  };

  const onTrailerChange = (e) => {
    const file = e.target.files?.[0] || null;
    setTrailerFile(file);
    setTrailerPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return file ? URL.createObjectURL(file) : null;
    });
  };

  const addCastRow = () => setCasts((s) => [...s, { name: "", file: null, previewUrl: null }]);
  const removeCastRow = (idx) =>
    setCasts((s) => {
      const copy = s.slice();
      if (copy[idx]?.previewUrl) URL.revokeObjectURL(copy[idx].previewUrl);
      copy.splice(idx, 1);
      return copy.length ? copy : [{ name: "", file: null, previewUrl: null }];
    });

  const onCastNameChange = (idx, value) =>
    setCasts((s) => s.map((c, i) => (i === idx ? { ...c, name: value } : c)));

  const onCastFileChange = (idx, file) =>
    setCasts((s) =>
      s.map((c, i) =>
        i === idx ? { ...c, file, previewUrl: file ? URL.createObjectURL(file) : null } : c
      )
    );

  const handleSubmit = async (e) => {
    e?.preventDefault?.();

    // ensure genresArray is populated if user didn't blur the input
    if (genresArray.length === 0 && genreInput.trim()) {
      const arr = genreInput.split(",").map((g) => g.trim()).filter(Boolean);
      setGenresArray(arr);
      // use the parsed arr for validation and submit
      // (don't rely on state to update synchronously)
      if (arr.length === 0) return toast.error("Please add at least one genre (comma separated).");
    }

    if (!title || !description || !releaseDate || !language || !runtime) {
      return toast.error("Please fill required fields (title, date, language, runtime).");
    }
    if (!backdropFile) return toast.error("Please upload a backdrop/poster image.");
    if (genresArray.length === 0 && !genreInput.trim()) return toast.error("Please add at least one genre (comma separated).");

    // ensure we have the genres array to send
    const finalGenres = genresArray.length ? genresArray : genreInput.split(",").map((g) => g.trim()).filter(Boolean);

    const castsMeta = casts.map((c) => ({ name: c.name || "" }));

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("release_date", releaseDate);
    formData.append("language", language);
    formData.append("runtime", runtime);

    // send JSON string (backend parses this) AND a human-friendly string for Postman/UI
    formData.append("genres", JSON.stringify(finalGenres)); // backend-friendly
    formData.append("genres_text", finalGenres.join(", ")); // for Postman/readable display

    formData.append("backdrop_path", backdropFile);
    if (trailerFile) formData.append("trailer", trailerFile);

    formData.append("casts", JSON.stringify(castsMeta));
    casts.forEach((c, idx) => {
      if (c.file) formData.append(`castsImage_${idx}`, c.file);
    });

    // debug: log keys so you can inspect the payload in console (safe)
    for (const pair of formData.entries()) {
      // don't stringify File objects (they'll show as File)
      if (pair[1] instanceof File) console.log("[formData] ", pair[0], pair[1].name, pair[1].type, pair[1].size);
      else console.log("[formData] ", pair[0], pair[1]);
    }

    try {
      setLoading(true);
      let token = "";
      try { token = getToken ? await getToken() : ""; } catch {}
      const { data } = await axios.post("/api/upcoming/add", formData, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        timeout: 1200000,
      });

      if (data?.success) {
        toast.success("Upcoming movie added!");
        if (backdropPreview) URL.revokeObjectURL(backdropPreview);
        if (trailerPreview) URL.revokeObjectURL(trailerPreview);
        casts.forEach((c) => c.previewUrl && URL.revokeObjectURL(c.previewUrl));

        setTitle(""); setDescription(""); setReleaseDate(""); setLanguage(""); setRuntime("");
        setGenreInput(""); setGenresArray([]);
        setBackdropFile(null); setBackdropPreview(null);
        setTrailerFile(null); setTrailerPreview(null);
        setCasts([{ name: "", file: null, previewUrl: null }]);
        if (backdropRef.current) backdropRef.current.value = "";
        if (trailerRef.current) trailerRef.current.value = "";
        Object.values(castFileRefs.current).forEach((ref) => { if (ref?.current) ref.current.value = ""; });
      } else {
        toast.error(data.message || "Failed to add upcoming movie");
      }
    } catch (err) {
      console.error("addUpcoming error:", err.response?.data || err.message || err);
      // show readable message when backend returns genres_text or message
      const serverMsg = err.response?.data?.message || err.response?.data?.genres_text || err.message;
      toast.error(serverMsg || "Server error while adding upcoming movie");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto text-white">
      <Title text1="Add" text2="Upcoming" />

      <div className="space-y-6 mt-10 bg-gray-900/60 border border-gray-700 p-6 rounded-2xl shadow-lg backdrop-blur-sm">
        {/* Form fields (Title, Date, Language, Runtime) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <input
    placeholder="🎬 Movie Title *"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    className="p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
  />

  <input
    type="date"
    value={releaseDate}
    onChange={(e) => setReleaseDate(e.target.value)}
    min={new Date().toISOString().split("T")[0]} // only future dates
    className="p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
  />

  <input
    placeholder="🌐 Language *"
    value={language}
    onChange={(e) => setLanguage(e.target.value)}
    className="p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
  />

  <input
    type="number"
    placeholder="⏱ Runtime (minutes) *"
    value={runtime}
    onChange={(e) => setRuntime(e.target.value)}
    className="p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
  />
</div>

{/* Description full-width */}
<div className="mt-4">
  <label className="block text-sm font-medium mb-2 text-gray-300">📝 Description</label>
  <textarea
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    placeholder="Enter movie description..."
    rows={4}
    className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none text-white resize-none"
  />
</div>


        {/* Genres */}
        <div>
          <input
            placeholder="🎭 Genres (comma separated)"
            value={genreInput} onChange={(e) => setGenreInput(e.target.value)}
            onBlur={handleGenreParse}
            className="p-3 rounded-lg bg-gray-800 border border-gray-700 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <small className="text-gray-400 block mt-1">Parsed: <span className="text-blue-400">{genresArray.join(", ")}</span></small>
        </div>

        {/* Backdrop & Trailer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Backdrop / Poster *</label>
            <input ref={backdropRef} type="file" accept="image/*" onChange={(e) => onBackdropChange(e)} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white hover:file:bg-primary-dull hover:file:text-black cursor-pointer" />
            {backdropPreview && <img src={backdropPreview} alt="backdrop preview" className="mt-3 w-56 h-32 object-cover rounded-lg border border-gray-700" />}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Trailer (optional)</label>
            <input ref={trailerRef} type="file" accept="video/*" onChange={(e) => onTrailerChange(e)} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-dull file:text-black hover:file:bg-primary hover:file:text-white cursor-pointer" />
            {trailerPreview && <video src={trailerPreview} controls className="mt-3 w-full max-w-md rounded-lg border border-gray-700" />}
          </div>
        </div>

        {/* Casts */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-200">🎭 Cast Members</h3>
          <p className="text-sm text-gray-400 mb-4">Add actor names and their images. Click + to add more.</p>
          {casts.map((cast, idx) => (
            <div key={idx} className="flex flex-wrap gap-3 items-center mb-3 bg-gray-800 p-3 rounded-lg border border-gray-700">
              <input value={cast.name} onChange={(e) => onCastNameChange(idx, e.target.value)} placeholder="👤 Actor name" className="p-2 rounded bg-gray-900 border border-gray-700 text-white flex-1 focus:ring-2 focus:ring-blue-500" />
              <input type="file" accept="image/*" onChange={(e) => onCastFileChange(idx, e.target.files?.[0] || null)} className="text-sm text-gray-300 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-primary file:text-white hover:file:bg-primary-dull hover:file:text-black cursor-pointer" ref={(el) => { if (!castFileRefs.current[idx]) castFileRefs.current[idx] = { current: el }; else castFileRefs.current[idx].current = el; }} />
              {cast.previewUrl && <img src={cast.previewUrl} alt="cast" className="w-12 h-12 object-cover rounded-full border border-gray-600" />}
              <button type="button" onClick={() => removeCastRow(idx)} className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg text-sm">Remove</button>
            </div>
          ))}
          <button type="button" onClick={addCastRow} className="mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium">+ Add Cast</button>
        </div>

        {/* Submit */}
        <div className="pt-4 text-center">
          <button onClick={handleSubmit} disabled={loading} className="px-6 py-3 bg-primary-dull text-black hover  hover:bg-primary hover:text-white rounded-lg font-semibold tracking-wide transition-all">
            {loading ? "Adding..." : " Add Upcoming Movie"}
          </button>
        </div>
      </div>
    </div>
  );
}
