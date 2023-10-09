import http from 'k6/http';
import { check } from 'k6';

export const options = {
	scenarios: {
		constant_request_rate: {
			executor: 'constant-arrival-rate',
			rate: 65,
			timeUnit: '1s', // 1000 iterations per second, i.e. 1000 RPS
			duration: '30s',
			preAllocatedVUs: 100, // how large the initial pool of VUs would be
			maxVUs: 300 // if the preAllocatedVUs are not enough, we can initialize more
		}
	}
};

export function setup() {
	const signinUrl = 'http://localhost:3000/api/v1/internal/signin';
	const signinPayload = JSON.stringify({ email: 'sample@example.com', password: 'password' });
	const signinParams = { headers: { 'Content-Type': 'application/json' } };

	const signinRes = http.post(signinUrl, signinPayload, signinParams);
	const { token } = signinRes.json();

	const postUrl = 'http://localhost:3000/api/v1/post';
	const postPayload = JSON.stringify({ title: '負荷テスト' });
	const postParams = {
		headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
	};
	const postRes = http.post(postUrl, postPayload, postParams);
	const { id } = postRes.json();
	return { token, postId: id };
}

export default function (data) {
	const url = `http://localhost:3000/api/v1/post/${data.postId}/comment`;
	const payload = JSON.stringify({ content: 'コメント' });
	const params = {
		headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${data.token}` }
	};
	const res = http.post(url, payload, params);
	check(res, {
		'is status 200': (r) => r.status === 200
	});
}
