import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

export default function CompletionScreen({
  studysetId,
  stats,
  totalCards,
  sessionDuration,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 90) return "text-green-600";
    if (accuracy >= 75) return "text-blue-600";
    if (accuracy >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getAccuracyEmoji = (accuracy) => {
    if (accuracy >= 90) return "🌟";
    if (accuracy >= 75) return "🎉";
    if (accuracy >= 60) return "👍";
    return "💪";
  };

  const handleBackToSet = () => {
    navigate(`/studysets/${studysetId}`);
  };

  const handleRestart = () => {
    window.location.reload();
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
        <div className="text-8xl mb-6 animate-bounce">
          {getAccuracyEmoji(stats.accuracy)}
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          {t("congratulations")}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {t("completed_learning_session")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
            <div className="text-sm text-gray-600 uppercase tracking-wide mb-2">
              {t("accuracy")}
            </div>
            <div
              className={`text-4xl font-bold ${getAccuracyColor(stats.accuracy)}`}
            >
              {stats.accuracy}%
            </div>
            <div className="text-sm text-gray-500 mt-2">
              {stats.correctAnswers} / {stats.totalAnswers} {t("correct")}
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6">
            <div className="text-sm text-gray-600 uppercase tracking-wide mb-2">
              {t("cards_learned")}
            </div>
            <div className="text-4xl font-bold text-green-600">
              {totalCards}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              {t("all_mastered")}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6">
            <div className="text-sm text-gray-600 uppercase tracking-wide mb-2">
              {t("time_spent")}
            </div>
            <div className="text-4xl font-bold text-purple-600">
              {formatDuration(sessionDuration)}
            </div>
            <div className="text-sm text-gray-500 mt-2">{t("great_focus")}</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6 mb-8">
          <p className="text-lg text-gray-700">
            {stats.accuracy >= 90
              ? t("excellent_work")
              : stats.accuracy >= 75
                ? t("great_job")
                : stats.accuracy >= 60
                  ? t("good_effort")
                  : t("keep_practicing")}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleRestart}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 font-semibold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            🔄 {t("study_again")}
          </button>

          <button
            onClick={handleBackToSet}
            className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            ← {t("back_to_set")}
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-3">{t("share_achievement")}</p>
          <div className="flex justify-center gap-3">
            <button className="w-10 h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
              𝕏
            </button>
            <button className="w-10 h-10 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors">
              📱
            </button>
            <button className="w-10 h-10 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors">
              📧
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
