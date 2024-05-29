import { Flex, Typography, theme } from "antd";
import style from "./index.module.scss";
import { useEffect, useRef } from "react";
import classNames from "classnames";
import { observer } from "mobx-react-lite";
import { gstate } from "@/global";
import { ImageInput } from "../ImageInput";
import { state } from "./state";
import { createImageList } from "@/engines/transform";
import { getFilesFromEntry, getFilesFromHandle } from "@/functions";
import { sprintf } from "sprintf-js";
import { Mimes } from "@/mimes";

export const UploadCard = observer(() => {
  const { token } = theme.useToken();
  const fileRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dragLeave = () => {
      state.dragActive = false;
    };
    const dragOver = (event: DragEvent) => {
      event.preventDefault();
      state.dragActive = true;
    };
    const drop = async (event: DragEvent) => {
      event.preventDefault();
      state.dragActive = false;
      const files: Array<File> = [];
      if (event.dataTransfer?.items) {
        for (let i = 0; i < event.dataTransfer.items.length; i++) {
          const item = event.dataTransfer.items[i];
          if (typeof item.getAsFileSystemHandle === "function") {
            const handle = await item.getAsFileSystemHandle();
            const result = await getFilesFromHandle(handle);
            files.push(...result);
            continue;
          }
          if (typeof item.webkitGetAsEntry === "function") {
            const entry = await item.webkitGetAsEntry();
            if (entry) {
              const result = await getFilesFromEntry(entry);
              files.push(...result);
              continue;
            }
          }
        }
      } else if (event.dataTransfer?.files) {
        const list = event.dataTransfer?.files;
        for (let index = 0; index < list.length; index++) {
          const file = list.item(index);
          file && files.push(file);
          if (file) {
            files.push(file);
          }
        }
      }

      files.length > 0 && createImageList(files);
    };

    const target = dragRef.current!;
    target.addEventListener("dragover", dragOver);
    target.addEventListener("dragleave", dragLeave);
    target.addEventListener("drop", drop);

    return () => {
      target.removeEventListener("dragover", dragOver);
      target.removeEventListener("dragleave", dragLeave);
      target.removeEventListener("drop", drop);
    };
  }, []);

  return (
    <Flex
      justify="center"
      align="center"
      className={classNames(style.container, state.dragActive && style.active)}
      style={{ borderRadius: token.borderRadiusLG }}
    >
      <Flex vertical align="center" className={style.inner}>
        
        <svg xmlns="http://www.w3.org/2000/svg" width="70" height="66" viewBox="0 0 70 66" fill="none">
          <path d="M37.943 53.6246C37.943 45.9246 43.7003 39.1655 51.2972 37.9269C53.5384 37.5615 55.7824 37.7069 57.9788 38.2559V22.2273C57.9788 18.6444 55.0795 15.7451 51.4966 15.7451H6.71069C3.12791 15.7451 0.228516 18.6444 0.228516 22.2273V50.5131C0.228516 54.0961 3.12791 56.9953 6.71069 56.9953H38.2966C38.1788 56.4767 38.108 55.9582 38.0373 55.4161C37.9666 54.8738 37.943 54.261 37.943 53.6246ZM19.7458 31.9624C19.0622 31.2787 17.9308 31.2787 17.2472 31.9624L3.76425 45.4452V22.2273C3.76425 20.6009 5.08425 19.2808 6.71069 19.2808H51.4966C53.1231 19.2808 54.4431 20.6009 54.4431 22.2273V36.8181L41.738 24.113C41.0545 23.4295 39.9231 23.4295 39.2394 24.113L25.5679 37.7845L19.7458 31.9624Z" fill="#1B86C8" />
          <path d="M68.5858 10.5361C67.5959 9.12183 66.1108 8.17893 64.4137 7.8725C64.4137 7.8725 20.3496 0.100676 20.3113 0.0939108C16.8498 -0.516663 13.4112 1.92075 12.792 5.35032L11.5898 12.2097H51.4964C57.0123 12.2097 61.5143 16.7118 61.5143 22.2276V39.6941C62.7346 40.3652 63.9905 41.2273 64.9322 42.2634L69.6701 15.3682C69.9766 13.6711 69.5759 11.9505 68.5858 10.5361Z" fill="#1B86C8" />
          <path d="M25.5686 27.9083C26.545 27.9083 27.3365 27.1168 27.3365 26.1404C27.3365 25.1641 26.545 24.3726 25.5686 24.3726C24.5923 24.3726 23.8008 25.1641 23.8008 26.1404C23.8008 27.1168 24.5923 27.9083 25.5686 27.9083Z" fill="#1B86C8" />
          <path d="M61.8585 44.2079C59.6718 42.3599 56.7218 41.25 53.8536 41.25C47.0296 41.25 41.4785 46.8021 41.4785 53.6249C41.4785 60.3725 47.1099 66.0001 53.8536 66.0001C60.6776 66.0001 66.2286 60.4479 66.2286 53.6251C66.2286 49.988 64.653 46.5697 61.8585 44.2079ZM59.8178 53.6858C59.1272 54.3764 58.0085 54.3764 57.3179 53.6858L55.6214 51.9893V59.5073C55.6214 60.4833 54.8296 61.2752 53.8536 61.2752C52.8776 61.2752 52.0857 60.4833 52.0857 59.5073V51.9893L50.3892 53.6858C49.6986 54.3764 48.5799 54.3764 47.8893 53.6858C47.1987 52.9952 47.1987 51.8765 47.8893 51.1859C47.8893 51.1859 52.6002 46.475 52.6036 46.4716C53.2805 45.7947 54.4274 45.7956 55.1035 46.4716L59.8178 51.1859C60.5084 51.8765 60.5084 52.9952 59.8178 53.6858Z" fill="#1B86C8" />
        </svg>
        <Typography.Text>{gstate.locale?.uploadCard.title}</Typography.Text>
        <div>
          {sprintf(
            gstate.locale?.uploadCard.subTitle ?? "",
            Object.keys(Mimes)
              .map((item) => item.toUpperCase())
              .join("/"),
          )}
        </div>
      </Flex>
      <ImageInput ref={fileRef} />
      <div
        className={style.mask}
        ref={dragRef}
        onClick={() => {
          fileRef.current?.click();
        }}
      />
    </Flex>
  );
});
