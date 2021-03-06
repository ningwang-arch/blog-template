/* eslint-disable no-console */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-plusplus */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { Input, Select, Button, notification } from 'antd';
import { connect } from 'dva';
import SimpleMDE from 'simplemde';
import marked from 'marked';
import highlight from 'highlight.js';
import 'simplemde/dist/simplemde.min.css';
import './style.less';

@connect(({ article, tag, category }) => ({
	article,
	tag,
	category,
}))
class ArticleCreate extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			smde: null,
			loading: false,
			keywordCom: '',
			pageNum: 1,
			pageSize: 50,
			changeType: false,
			title: '',
			author: 'eclipse',
			keyword: '',
			content: '',
			desc: '',
			img_url: '',
			tags: '',
			category: '',
			tagsDefault: [],
			categoryDefault: [],
		};
		this.handleSearchTag = this.handleSearchTag.bind(this);
		this.handleSearchCategory = this.handleSearchCategory.bind(this);
		this.getSmdeValue = this.getSmdeValue.bind(this);
		this.setSmdeValue = this.setSmdeValue.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleCategoryChange = this.handleCategoryChange.bind(this);
		this.handleChangeState = this.handleChangeState.bind(this);
		this.handleTagChange = this.handleTagChange.bind(this);
		this.handleChangeOrigin = this.handleChangeOrigin.bind(this);
		this.handleChangeType = this.handleChangeType.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		this.handleSearchTag();
		this.handleSearchCategory();

		this.state.smde = new SimpleMDE({
			element: document.getElementById('editor').childElementCount,
			autofocus: true,
			autosave: true,
			previewRender(plainText) {
				return marked(plainText, {
					renderer: new marked.Renderer(),
					gfm: true,
					pedantic: false,
					sanitize: false,
					tables: true,
					breaks: true,
					smartLists: true,
					smartypants: true,
					highlight(code) {
						return highlight.highlightAuto(code).value;
					},
				});
			},
		});
	}

	getSmdeValue() {
		// console.log('this.state.smde.value() :', this.state.smde.value());
		return this.state.smde.value();
	}

	setSmdeValue(value) {
		this.state.smde.value(value);
	}

	handleSearchTag = () => {
		this.setState({
			loading: true,
		});
		const { dispatch } = this.props;
		const params = {
			keyword: this.state.keywordCom,
			pageNum: this.state.pageNum,
			pageSize: this.state.pageSize,
		};
		new Promise(resolve => {
			dispatch({
				type: 'tag/queryTag',
				payload: {
					resolve,
					params,
				},
			});
		}).then(res => {
			// console.log('res :', res);
			if (res.code === 0) {
				this.setState({
					loading: false,
				});
			} else {
				notification.error({
					message: res.message,
				});
			}
		});
	};

	handleSearchCategory = () => {
		this.setState({
			loading: true,
		});
		const { dispatch } = this.props;
		const params = {
			keyword: this.state.keyword,
			pageNum: this.state.pageNum,
			pageSize: this.state.pageSize,
		};
		new Promise(resolve => {
			dispatch({
				type: 'category/queryCategory',
				payload: {
					resolve,
					params,
				},
			});
		}).then(res => {
			// console.log('res :', res);
			if (res.code === 0) {
				this.setState({
					loading: false,
				});
			} else {
				notification.error({
					message: res.message,
				});
			}
		});
	};

	handleSubmit() {
		const { dispatch } = this.props;
		const { articleDetail } = this.props.article;
		if(!this.state.title){
			notification.error({
				message: "????????????????????????",
			});
			return
		}
		if(!this.state.keyword){
			notification.error({
				message: "???????????????????????????",
			});
			return
		}
		if(!this.state.smde.value()){
			notification.error({
				message: "????????????????????????",
			});
			return
		}
		let keyword = this.state.keyword;
		if (keyword instanceof Array) {
			keyword = keyword.join(',');
		}
		this.setState({
			loading: true,
		});
		// ??????
		if (this.state.changeType) {
			const params = {
				id: articleDetail._id,
				title: this.state.title,
				author: this.state.author,
				desc: this.state.desc,
				keyword,
				content: this.state.content,
				img_url: this.state.img_url,
				origin: this.state.origin,
				state: this.state.state,
				type: this.state.type,
				tags: this.state.tags,
				category: this.state.category,
			};
			new Promise(resolve => {
				dispatch({
					type: 'article/updateArticle',
					payload: {
						resolve,
						params,
					},
				});
			}).then(res => {
				if (res.code === 0) {
					notification.success({
						message: res.message,
					});
					this.setState({
						changeType: false,
						title: '',
						author: 'eclipse',
						keyword: '',
						content: '',
						desc: '',
						img_url: '',
						tags: '',
						category: '',
						tagsDefault: [],
						categoryDefault: [],
					});
					this.handleSearch(this.state.pageNum, this.state.pageSize);
				} else {
					notification.error({
						message: res.message,
					});
				}
			});
		} else {
			// ??????
			const params = {
				title: this.state.title,
				author: this.state.author,
				desc: this.state.desc,
				keyword: this.state.keyword,
				content: this.state.smde.value(),
				img_url: this.state.img_url,
				origin: this.state.origin,
				state: this.state.state,
				type: this.state.type,
				tags: this.state.tags,
				category: this.state.category,
			};
			new Promise(resolve => {
				dispatch({
					type: 'article/addArticle',
					payload: {
						resolve,
						params,
					},
				});
			}).then(res => {
				if (res.code === 0) {
					notification.success({
						message: res.message,
					});
					this.setState({
						loading: false,
					});
					// this.handleSearch(this.state.pageNum, this.state.pageSize);
				} else {
					notification.error({
						message: res.message,
					});
				}
			});
		}
	}




	handleChange(event) {
		this.setState({
			[event.target.name]: event.target.value,
		});
	}

	handleTagChange(value) {
		const tags = value.join();
		this.setState({
			tagsDefault: value,
			tags,
		});
	}

	handleCategoryChange(value) {
		const category = value.join();
		this.setState({
			categoryDefault: value,
			category,
		});
	}

	handleChangeState(value) {
		this.setState({
			state: value,
		});
	}

	handleChangeOrigin(value) {
		this.setState({
			origin: value,
		});
	}

	handleChangeType(value) {

		this.setState({
			type: value,
		});
	}

	

	render() {
		const { tagList } = this.props.tag;
		const { categoryList } = this.props.category;
		const children = [];
		const categoryChildren = [];
		if(tagList){
		for (let i = 0; i < tagList.length; i++) {
			const e = tagList[i];
			children.push(
  <Select.Option key={e._id} value={e._id}>
    {e.name}
  </Select.Option>,
			);
		}
	}
	if(categoryList){
		for (let i = 0; i < categoryList.length; i++) {
			const e = categoryList[i];
			categoryChildren.push(
  <Select.Option key={e._id} value={e._id}>
    {e.name}
  </Select.Option>,
			);
		}
	}
		// const { articleDetail } = this.props.article;
		// const { changeType } = this.props;
		let categoryDefault = [];
		let tagsDefault = [];
		// if (changeType) {
		// 	originDefault = articleDetail.origin === 0 ? '??????' : '';
		// 	stateDefault = articleDetail.state ? '?????????' : '??????';
		// 	typeDefault = articleDetail.type === 1 ? '????????????' : articleDetail.type === 2 ? '??????' : '???????????????';
		// 	categoryDefault = this.props.categoryDefault;
		// 	tagsDefault = this.props.tagsDefault;
		// } else {
		categoryDefault = [];
		tagsDefault = [];
		// }
		const normalCenter = {
			textAlign: 'center',
			marginBottom: 10,
		};

		return (
  <div>
    <Input
      style={normalCenter}
      addonBefore="??????"
      size="large"
      placeholder="??????"
      name="title"
      value={this.state.title}
      onChange={this.handleChange}
    />
    <Input
      style={normalCenter}
      addonBefore="??????"
      size="large"
      placeholder="??????"
      name="author"
      value={this.state.author}
      onChange={this.handleChange}
    />
    <Input
      style={normalCenter}
      addonBefore="?????????"
      size="large"
      placeholder="?????????"
      name="keyword"
      value={this.state.keyword}
      onChange={this.handleChange}
    />
    <Input
      style={normalCenter}
      addonBefore="??????"
      size="large"
      placeholder="??????"
      name="desc"
      value={this.state.desc}
      onChange={this.handleChange}
    />
    <Input
      style={normalCenter}
      addonBefore="????????????"
      size="large"
      placeholder="????????????"
      name="img_url"
      value={this.state.img_url}
      onChange={this.handleChange}
    />



    <Select
      allowClear
      mode="multiple"
      style={{ width: 400, marginLeft: 0, marginBottom: 20 }}
      placeholder="??????"
      defaultValue={tagsDefault}
      value={this.state.tagsDefault}
      onChange={this.handleTagChange}
    >
      {children}
    </Select>
    <Select
      allowClear
      mode="multiple"
      style={{ width: 400, marginLeft: 10, marginBottom: 10 }}
      placeholder="????????????"
      defaultValue={categoryDefault}
      value={this.state.categoryDefault}
      onChange={this.handleCategoryChange}
    >
      {categoryChildren}
    </Select>
    <div>
      <Button
        onClick={() => {
							this.handleSubmit();
						}}
        loading={this.state.loading}
        style={{ marginBottom: '10px' }}
        type="primary"
      // eslint-disable-next-line react/jsx-closing-tag-location
      >??????</Button>
    </div>

    <div title="?????????????????????" width="1200px">
      <textarea id="editor" style={{ marginBottom: 20, width: 800 }} size="large" rows={6} />
    </div>
  </div>
		);
	}
}

export default ArticleCreate;
