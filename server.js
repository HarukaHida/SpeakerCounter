require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Client, GatewayIntentBits } = require('discord.js');

const app = express();
app.use(cors()); // フロントエンドからのアクセスを許可する
app.use(express.json());

// Discord Botの初期化（メッセージ内容を読み込む権限を設定）
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Botが正常に起動したときのログ
client.once('ready', () => {
    console.log(`🤖 Discord Botがログインしました: ${client.user.tag}`);
});

/* フロントエンドから「チャンネルID」を受け取って集計を返す */
app.get('/api/count/:channelId', async (req, res) => {
    const { channelId } = req.params;

    try {
        // Discordの特定のチャンネルを取得
        const channel = await client.channels.fetch(channelId);
        if (!channel || !channel.isTextBased()) {
            return res.status(400).json({ error: 'テキストチャンネルが見つかりません。' });
        }

        // 過去のメッセージ履歴を最大100件取得（fetchの仕様上、1回で取れる最大が100件です）
        const messages = await channel.messages.fetch({ limit: 100 });
        
        // 【集計ロジック】メッセージをループして、発言者ごとの回数をカウント
        const counterMap = {};
        messages.forEach(msg => {
            // Bot自身の発言やシステムメッセージは除外する
            if (msg.author.bot) return;

            const name = msg.author.displayName || msg.author.username; // サーバーでの表示名、なければユーザー名
            if (counterMap[name]) {
                counterMap[name] += 1;
            } else {
                counterMap[name] = 1;
            }
        });

        // フロントエンドが扱いやすい「配列」の形に整形
        const result = Object.keys(counterMap).map(name => ({
            name: name,
            count: counterMap[name]
        }));

        // カウントのソート
        result.sort((a, b) => b.count - a.count);

        res.json(result);

    } catch (error) {
        console.error('エラーが発生しました:', error);
        res.status(500).json({ error: 'Discordからのデータ取得に失敗しました。Botがサーバーにいるか、権限があるか確認してください。' });
    }
});

// サーバーの起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 バックエンドサーバーが起動しました: http://localhost:${PORT}`);
});

// Discord Botのログイン
client.login(process.env.DISCORD_TOKEN);