import { Upload, X, Image as ImageIcon } from "lucide-react";
import { IKContext } from "imagekitio-react";
import { useState, useRef } from "react";
import "./ImageKitUpload.css";

// Configurações do ImageKit (lidas das variáveis de ambiente)
const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;
const urlEndpoint = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;
const authEndpoint = import.meta.env.VITE_IMAGEKIT_AUTH_ENDPOINT;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Função de autenticação que chama a Edge Function
const authenticator = async () => {
  try {
    const response = await fetch(authEndpoint, {
      headers: {
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error) {
    throw new Error(`Authentication request failed: ${(error as Error).message}`);
  }
};

interface ImageKitUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  minImages?: number;
  maxImages?: number;
  coverImage?: string;
  onCoverImageChange?: (url: string) => void;
  folder?: string;
}

const ImageKitUpload = ({
  images,
  onImagesChange,
  minImages = 0,
  maxImages = 20,
  coverImage,
  onCoverImageChange,
  folder = "/properties",
}: ImageKitUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  const handleSuccess = (urls: string[]) => {
    const availableSlots = Math.max(0, maxImages - images.length);
    const toAdd = urls.slice(0, availableSlots);
    if (toAdd.length === 0) {
      setUploading(false);
      return;
    }
    const newImages = [...images, ...toAdd];
    onImagesChange(newImages);
    if (!coverImage && onCoverImageChange) {
      onCoverImageChange(toAdd[0]);
    }
    setUploading(false);
  };

  const handleError = (error: Error) => {
    console.error("Erro no upload:", error);
    alert(`Erro ao fazer upload da imagem: ${error.message}`);
    setUploading(false);
  };

  const uploadFile = async (file: File) => {
    const { signature, expire, token } = await authenticator();
    const form = new FormData();
    form.append("file", file);
    form.append("fileName", file.name);
    form.append("folder", folder);
    form.append("useUniqueFileName", "true");
    form.append("publicKey", publicKey);
    form.append("signature", signature);
    form.append("token", token);
    form.append("expire", String(expire));
    const res = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
      method: "POST",
      body: form,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Falha no upload");
    }
    const data = await res.json();
    return data?.url as string;
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const availableSlots = Math.max(0, maxImages - images.length);
    const selected = Array.from(files).slice(0, availableSlots);
    if (selected.length === 0) return;
    try {
      setUploading(true);
      const results = await Promise.allSettled(selected.map(uploadFile));
      const urls = results
        .filter((r) => r.status === "fulfilled")
        .map((r) => (r as PromiseFulfilledResult<string>).value)
        .filter(Boolean);
      if (urls.length > 0) {
        handleSuccess(urls);
      } else {
        throw new Error("Nenhuma imagem enviada");
      }
    } catch (err: any) {
      handleError(err);
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    const imageToRemove = images[index];
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);

    // Se a imagem removida era a capa, define a primeira da lista como capa
    if (coverImage === imageToRemove && onCoverImageChange && newImages.length > 0) {
      onCoverImageChange(newImages[0]);
    } else if (coverImage === imageToRemove && onCoverImageChange) {
      onCoverImageChange("");
    }
  };

  const handleSetCover = (url: string) => {
    if (onCoverImageChange) {
      onCoverImageChange(url);
    }
  };

  const canUpload = images.length < maxImages;

  if (!publicKey || !urlEndpoint || !authEndpoint) {
    return (
      <div className="imagekit-upload-error">
        <p>Configuração do ImageKit não encontrada. Verifique as variáveis de ambiente.</p>
      </div>
    );
  }

  return (
    <div className="imagekit-upload-container">
      <IKContext publicKey={publicKey} urlEndpoint={urlEndpoint} authenticator={authenticator}>
        {canUpload && (
          <div
            className="imagekit-upload-area"
            onClick={handleUploadClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleUploadClick();
              }
            }}
          >
            <Upload className="imagekit-upload-icon" />
            <p className="imagekit-upload-text">
              Clique para fazer upload ou arraste as imagens
            </p>
            <p className="imagekit-upload-hint">
              {images.length} de {maxImages} imagens
              {minImages > 0 && ` (mínimo: ${minImages})`}
            </p>
          </div>
        )}

        {!canUpload && (
          <div className="imagekit-upload-limit">
            <p>{maxImages === 1 ? 'Imagem única selecionada' : `Limite de ${maxImages} imagens atingido`}</p>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleInputChange}
        />

        {images.length > 0 && (
          <div className="imagekit-preview-grid">
            {images.map((url, index) => (
              <div
                key={index}
                className={`imagekit-preview-item ${
                  coverImage === url ? "cover-image" : ""
                }`}
              >
                <div className="imagekit-preview-overlay">
                  {coverImage === url && (
                    <span className="imagekit-cover-badge">Capa</span>
                  )}
                  <div className="imagekit-preview-actions">
                    {coverImage !== url && onCoverImageChange && (
                      <button
                        type="button"
                        className="imagekit-action-btn"
                        onClick={() => handleSetCover(url)}
                        title="Definir como capa"
                      >
                        <ImageIcon size={16} />
                      </button>
                    )}
                    <button
                      type="button"
                      className="imagekit-action-btn imagekit-remove-btn"
                      onClick={() => handleRemoveImage(index)}
                      title="Remover imagem"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
                <img src={url} alt={`Imagem ${index + 1}`} />
              </div>
            ))}
          </div>
        )}

        {uploading && (
          <div className="imagekit-uploading">
            <p>Enviando imagem...</p>
          </div>
        )}
      </IKContext>
    </div>
  );
};

export default ImageKitUpload;

