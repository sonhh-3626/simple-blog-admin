import { useTranslations } from 'next-intl';

interface ItemsPerPageSelectorProps {
  postsPerPage: number;
  setPostsPerPage: (num: number) => void;
}

export default function ItemsPerPageSelector({
  postsPerPage,
  setPostsPerPage = () => {},
}: ItemsPerPageSelectorProps) {
  const t = useTranslations("ItemsPerPageSelector");
  return (
    <div className="w-full sm:w-auto flex items-center gap-2">
      <span className="text-sm text-gray-600">{t("postsPerPage")}:</span>
      <select
        value={postsPerPage}
        onChange={(e) => setPostsPerPage(Number(e.target.value))}
        className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
      >
        <option value={6}>6</option>
        <option value={9}>9</option>
        <option value={12}>12</option>
      </select>
    </div>

  )
}
