import { Content } from "@/types/page";
import { ImageComponent } from "./ImageComponent";
import { cn } from "@/lib/utils";

export const DynamicGrid = ({
  contentData,
  deviceType,
}: {
  contentData: Content;
  deviceType: SupportedDeviceType;
}) => {
  const getResponsiveGridOptions = () => {
    return {
      gridTemplateColumns: `repeat(${
        contentData.settings[deviceType].column ?? 1
      },auto)`,
    };
  };

  const { settings } = contentData;
  return (
    <div
      className={cn("w-full", {
        "sm:hidden block": deviceType === "mobile",
        "sm:block hidden": deviceType === "desktop",
      })}
      style={{ background: settings.background_color }}
    >
      <div style={{ display: "grid", ...getResponsiveGridOptions() }}>
        {contentData.section_data_array?.map((sectionData) => (
          <ImageComponent sectionData={sectionData} deviceType={deviceType} />
        ))}
      </div>
    </div>
  );
};
