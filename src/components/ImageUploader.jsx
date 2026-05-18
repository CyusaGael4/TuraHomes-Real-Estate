import { ImagePlus, Trash2, UploadCloud } from 'lucide-react'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function ImageUploader({ value = [], onChange }) {
  const [uploading, setUploading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleUpload = async (event) => {
    const files = Array.from(event.target.files || [])

    if (!files.length) {
      return
    }

    setUploading(true)
    setErrorMessage('')

    try {
      const urls = []

      for (const file of files) {
        const extension = file.name.split('.').pop()
        const path = `${crypto.randomUUID()}.${extension}`

        const { error } = await supabase.storage.from('property-images').upload(path, file)

        if (error) {
          throw error
        }

        const { data } = supabase.storage.from('property-images').getPublicUrl(path)
        urls.push(data.publicUrl)
      }

      onChange([...(value || []), ...urls])
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  return (
    <div className="space-y-4">
      <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[26px] border border-dashed border-[var(--color-gold)] bg-[rgba(204,162,79,0.08)] px-6 py-8 text-center transition hover:bg-[rgba(204,162,79,0.14)]">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[var(--color-gold-deep)] shadow-sm">
          <UploadCloud className="h-6 w-6" />
        </div>
        <div>
          <p className="font-medium text-[var(--color-ink)]">
            {uploading ? 'Uploading images...' : 'Upload property images'}
          </p>
          <p className="mt-1 text-sm text-[var(--color-muted)]">PNG, JPG, WEBP. You can select multiple files.</p>
        </div>
        <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
      </label>

      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

      {value?.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {value.map((imageUrl) => (
            <div
              key={imageUrl}
              className="group overflow-hidden rounded-[24px] border border-[var(--color-line)] bg-white shadow-sm"
            >
              <div className="relative h-40">
                <img src={imageUrl} alt="Property upload" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => onChange(value.filter((entry) => entry !== imageUrl))}
                  className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(9,31,57,0.86)] text-white opacity-0 transition group-hover:opacity-100"
                  aria-label="Remove image"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center gap-2 px-4 py-3 text-sm text-[var(--color-muted)]">
                <ImagePlus className="h-4 w-4 text-[var(--color-gold-deep)]" />
                Ready for listing
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
