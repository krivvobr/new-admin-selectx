import { Upload, X, Image as ImageIcon } from "lucide-react";
import { IKContext, IKUpload } from "imagekitio-react";
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
}

const ImageKitUpload = ({
  images,
  onImagesChange,
  minImages = 0,
  maxImages = 20,
  coverImage,
  onCoverImageChange,
}: ImageKitUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleUploadClick = () => {
    // O IKUpload cria um input dentro do container, então precisamos encontrar o input correto
    const fileInput = containerRef.current?.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleSuccess = (res: any) => {
    const newUrl = res.url;
    
    // Adiciona a nova imagem à lista
    const newImages = [...images, newUrl];
    onImagesChange(newImages);

    // Se não há imagem de capa, define a primeira como capa
    if (!coverImage && onCoverImageChange) {
      onCoverImageChange(newUrl);
    }

    setUploading(false);
  };

  const handleError = (error: Error) => {
    console.error("Erro no upload:", error);
    alert(`Erro ao fazer upload da imagem: ${error.message}`);
    setUploading(false);
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
    <div className="imagekit-upload-container" ref={containerRef}>
      <IKContext
        publicKey={publicKey}
        urlEndpoint={urlEndpoint}
        authenticator={authenticator}
      >
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
            <p>Limite de {maxImages} imagens atingido</p>
          </div>
        )}

        <IKUpload
          onSuccess={handleSuccess}
          onError={handleError}
          onUploadStart={() => setUploading(true)}
          style={{ display: "none" }}
          useUniqueFileName={true}
          folder="/properties"
          multiple
          accept="image/*"
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

