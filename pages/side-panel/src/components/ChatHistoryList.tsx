/* eslint-disable react/prop-types */
import { FaTrash } from 'react-icons/fa';
import { MdBookmarkBorder } from 'react-icons/md';
import { t } from '@extension/i18n';

interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
}

interface ChatHistoryListProps {
  sessions: ChatSession[];
  onSessionSelect: (sessionId: string) => void;
  onSessionDelete: (sessionId: string) => void;
  onSessionBookmark: (sessionId: string) => void;
  visible: boolean;
  isDarkMode?: boolean;
}

const ChatHistoryList: React.FC<ChatHistoryListProps> = ({
  sessions,
  onSessionSelect,
  onSessionDelete,
  onSessionBookmark,
  visible,
  isDarkMode = false,
}) => {
  if (!visible) return null;

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="h-full overflow-y-auto p-4 custom-scrollbar">
      <h2 className={`mb-4 text-lg font-bold tracking-wide ${isDarkMode ? 'text-white/90' : 'text-slate-800'}`}>
        {t('chat_history_title')}
      </h2>
      {sessions.length === 0 ? (
        <div
          className={`rounded-xl border p-6 text-center backdrop-blur-md ${
            isDarkMode ? 'border-white/5 bg-slate-900/20 text-gray-400' : 'border-white/30 bg-white/20 text-slate-600'
          }`}>
          {t('chat_history_empty')}
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map(session => (
            <div
              key={session.id}
              className={`group relative rounded-xl border backdrop-blur-md transition-all duration-200 ${
                isDarkMode
                  ? 'border-white/5 bg-slate-900/30 hover:bg-slate-800/50 hover:border-white/10 hover:shadow-lg'
                  : 'border-white/40 bg-white/20 hover:bg-white/40 hover:border-white/60 hover:shadow-md'
              } p-3`}>
              <button
                onClick={() => onSessionSelect(session.id)}
                className="w-full text-left outline-none"
                type="button">
                <h3
                  className={`text-sm font-semibold truncate pr-6 ${isDarkMode ? 'text-gray-100' : 'text-slate-800'}`}>
                  {session.title}
                </h3>
                <p className={`mt-1 text-xs font-medium ${isDarkMode ? 'text-white/40' : 'text-slate-500'}`}>
                  {formatDate(session.createdAt)}
                </p>
              </button>

              {/* Bookmark button - top right */}
              {onSessionBookmark && (
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onSessionBookmark(session.id);
                  }}
                  className={`absolute right-2 top-2 rounded-lg p-1.5 opacity-0 backdrop-blur-md transition-all group-hover:opacity-100 ${
                    isDarkMode
                      ? 'bg-white/10 text-purple-500 hover:bg-white/20 shadow-sm'
                      : 'bg-white/60 text-purple-500 hover:bg-white/90 shadow-sm'
                  }`}
                  aria-label={t('chat_history_bookmark')}
                  type="button">
                  <MdBookmarkBorder />
                </button>
              )}

              {/* Delete button - bottom right */}
              <button
                onClick={e => {
                  e.stopPropagation();
                  onSessionDelete(session.id);
                }}
                className={`absolute bottom-2 right-2 rounded-lg p-1.5 opacity-0 backdrop-blur-md transition-all group-hover:opacity-100 ${
                  isDarkMode
                    ? 'bg-white/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 shadow-sm'
                    : 'bg-white/60 text-red-500 hover:bg-red-50 hover:text-red-600 shadow-sm'
                }`}
                aria-label={t('chat_history_delete')}
                type="button">
                <FaTrash size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatHistoryList;
