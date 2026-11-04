// IDs are fixed so card history survives reordering or inserting cards.
// Give a new card the next unused number; never reuse or renumber an ID.
// Written for Japanese speakers, not translated from the Korean deck.
export const solutionCards = [
  // Take action
  { id: "solution-1", solution: "自分から連絡してみよう。" },
  { id: "solution-2", solution: "もう一回だけやってみよう。" },
  { id: "solution-3", solution: "小さくてもいいから始めよう。" },
  { id: "solution-4", solution: "言いたかったことを伝えよう。" },
  { id: "solution-5", solution: "今日、一歩だけ進もう。" },
  { id: "solution-6", solution: "思い切ってやってみよう。" },
  { id: "solution-7", solution: "助けを求めてもいい。" },
  { id: "solution-8", solution: "気持ちを行動で示そう。" },
  { id: "solution-9", solution: "後回しにしていたことを始めよう。" },
  { id: "solution-10", solution: "自分から笑顔を見せよう。" },

  // Make a choice
  { id: "solution-11", solution: "心が落ち着くほうを選ぼう。" },
  { id: "solution-12", solution: "ひとつに決めて進もう。" },
  { id: "solution-13", solution: "本当にやりたいほうを選ぼう。" },
  { id: "solution-14", solution: "後悔しないほうを選ぼう。" },
  { id: "solution-15", solution: "直感を信じよう。" },
  { id: "solution-16", solution: "自分の基準を信じよう。" },
  { id: "solution-17", solution: "楽なほうでも大丈夫。" },
  { id: "solution-18", solution: "いちばん大事なものを守ろう。" },
  { id: "solution-19", solution: "決めたなら、自分を信じよう。" },
  { id: "solution-20", solution: "答えは自分で決めていい。" },

  // Pause and rest
  { id: "solution-21", solution: "ひと息つこう。" },
  { id: "solution-22", solution: "今日は決めなくていい。" },
  { id: "solution-23", solution: "ゆっくりで大丈夫。" },
  { id: "solution-24", solution: "深呼吸してから見直そう。" },
  { id: "solution-25", solution: "今日はここまでにしよう。" },
  { id: "solution-26", solution: "少し距離を置いてみよう。" },
  { id: "solution-27", solution: "焦らなくていい。" },
  { id: "solution-28", solution: "一日だけ忘れてみよう。" },
  { id: "solution-29", solution: "一晩寝てから考えよう。" },
  { id: "solution-30", solution: "外の空気を吸いに行こう。" },

  // People and relationships
  { id: "solution-31", solution: "「ありがとう」を伝えよう。" },
  { id: "solution-32", solution: "誰かに「元気？」と聞いてみよう。" },
  { id: "solution-33", solution: "素直な気持ちを話そう。" },
  { id: "solution-34", solution: "話すより、まず聞こう。" },
  { id: "solution-35", solution: "謝ることがあるなら、謝ろう。" },
  { id: "solution-36", solution: "大切な人と過ごそう。" },
  { id: "solution-37", solution: "やさしい言葉をかけよう。" },
  { id: "solution-38", solution: "誰かに話すと、少し軽くなる。" },
  { id: "solution-39", solution: "久しぶりの友だちに連絡しよう。" },
  { id: "solution-40", solution: "思い込まずに聞いてみよう。" },

  // A new perspective
  { id: "solution-41", solution: "ここまで来た自分を振り返ろう。" },
  { id: "solution-42", solution: "比べるなら昨日の自分と。" },
  { id: "solution-43", solution: "ほかの方法も考えてみよう。" },
  { id: "solution-44", solution: "失敗からひとつ学ぼう。" },
  { id: "solution-45", solution: "もう持っているものを数えよう。" },
  { id: "solution-46", solution: "一歩引いて全体を見よう。" },
  { id: "solution-47", solution: "全部が自分のせいじゃない。" },
  { id: "solution-48", solution: "ゆっくりでも前に進んでいる。" },
  { id: "solution-49", solution: "小さな成功も成功。" },
  { id: "solution-50", solution: "当たり前を疑ってみよう。" },

  // Let go
  { id: "solution-51", solution: "過ぎたことは過ぎたこと。" },
  { id: "solution-52", solution: "全部の答えがなくてもいい。" },
  { id: "solution-53", solution: "変えられないことは手放そう。" },
  { id: "solution-54", solution: "少し肩の力を抜こう。" },
  { id: "solution-55", solution: "完璧より、まず完成。" },
  { id: "solution-56", solution: "人の期待は気にしすぎない。" },
  { id: "solution-57", solution: "役に立たない心配は置いておこう。" },
  { id: "solution-58", solution: "今日はひとつだけ手放そう。" },
  { id: "solution-59", solution: "全員に好かれなくていい。" },
  { id: "solution-60", solution: "終わったことは、そっとしておこう。" },

  // Take care of yourself
  { id: "solution-61", solution: "よく食べて、よく寝よう。" },
  { id: "solution-62", solution: "自分の味方でいよう。" },
  { id: "solution-63", solution: "あたたかい飲み物を飲もう。" },
  { id: "solution-64", solution: "好きなものを食べに行こう。" },
  { id: "solution-65", solution: "まず体をいたわろう。" },
  { id: "solution-66", solution: "今日は自分にやさしく。" },
  { id: "solution-67", solution: "今の気持ちを確かめよう。" },
  { id: "solution-68", solution: "必要なことだけやろう。" },
  { id: "solution-69", solution: "少し日に当たろう。" },
  { id: "solution-70", solution: "休憩はちゃんと取ろう。" },

  // Small things to do now
  { id: "solution-71", solution: "机の上を片づけよう。" },
  { id: "solution-72", solution: "水を一杯飲もう。" },
  { id: "solution-73", solution: "やることをひとつ書き出そう。" },
  { id: "solution-74", solution: "少し散歩しよう。" },
  { id: "solution-75", solution: "窓を開けよう。" },
  { id: "solution-76", solution: "いらない通知をオフにしよう。" },
  { id: "solution-77", solution: "小さな約束をひとつ守ろう。" },
  { id: "solution-78", solution: "カバンの中を整理しよう。" },
  { id: "solution-79", solution: "返せていないメッセージに返信しよう。" },
  { id: "solution-80", solution: "今日の気持ちを書いてみよう。" },

  // A gentle heads-up
  { id: "solution-81", solution: "大事なことはもう一度確認しよう。" },
  { id: "solution-82", solution: "大きな決断は一日置こう。" },
  { id: "solution-83", solution: "細かいところまで読もう。" },
  { id: "solution-84", solution: "感情的なときは返信を待とう。" },
  { id: "solution-85", solution: "話す前にひと呼吸。" },
  { id: "solution-86", solution: "簡単に約束しないで。" },
  { id: "solution-87", solution: "迷ったら、まず聞いてみよう。" },
  { id: "solution-88", solution: "買う前にもう一度考えよう。" },
  { id: "solution-89", solution: "疲れているときは大きな決断をしない。" },
  { id: "solution-90", solution: "言葉より行動を見よう。" },

  // A little luck and encouragement
  { id: "solution-91", solution: "うれしい知らせはすぐそこ。" },
  { id: "solution-92", solution: "小さな偶然が大きなチャンスに。" },
  { id: "solution-93", solution: "待っている答えはもうすぐ届く。" },
  { id: "solution-94", solution: "思いがけない出会いがありそう。" },
  { id: "solution-95", solution: "がんばりがもうすぐ実を結ぶ。" },
  { id: "solution-96", solution: "いい人との出会いが近づいている。" },
  { id: "solution-97", solution: "思ったより簡単かもしれない。" },
  { id: "solution-98", solution: "今日はきっと笑えることがある。" },
  { id: "solution-99", solution: "新しい道が開けてきている。" },
  { id: "solution-100", solution: "あなたの番はもうすぐ。" },
];
