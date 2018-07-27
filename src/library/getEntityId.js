import { Entity } from 'draft-js';

export const ACTION_PATH_MAP = {
  external: 'url',
  phone: 'url',
  email: 'email',
  file: 'resourceRef',
  anchor: 'anchor',
  'anchor-other-page': 'anchor',
  link: 'pageId',
}

const getHref = node => node.getAttribute ? node.getAttribute('href') || node.href : node.href

const getLinkConfig = {
  external: node => ({
    title: node.innerHTML,
    action: 'external',
    actions: {
      external: {
        url: getHref(node),
        target: node.target,
      },
    }
  }),
  email: node => {
    const [, email, subject] = getHref(node).match(/^mailto:([^?]+)(?:\?subject=(.*)|.*)?$/) || []
    return {
      title: node.innerHTML,
      action: 'email',
      actions: {
        email: {email, subject},
      },
    }
  },
  phone: node => {
    const [, url] = getHref(node).match(/^tel:(.*)$/) || []
    return {
      title: node.innerHTML,
      action: 'phone',
      actions: {
        phone: {url}
      },
    }
  },
  file: node => ({
    title: node.innerHTML,
    action: 'file',
    actions: {
      file: {
        resourceRef: node.dataset.ref,
      },
    },
  }),
  anchor: node => ({
    title: node.innerHTML,
    action: 'anchor',
    actions: {
      anchor: {
        anchor: node.dataset.anchor,
      },
    },
  }),
  'anchor-other-page': node => ({
    title: node.innerHTML,
    action: 'anchor-other-page',
    actions: {
      'anchor-other-page': {
        anchor: node.dataset.anchor,
      },
    },
  }),
  link: node => ({
    title: node.innerHTML,
    action: 'link',
    actions: {
      link: {
        pageId: node.dataset.slugId,
        target: node.target,
      },
    },
  }),
}



const getEntityId = (node) => {
  let entityId = undefined;
  if (
    node instanceof HTMLAnchorElement
  ) {
    const dataset = node.dataset
    let config = undefined
    if (Object.keys(dataset).length && dataset.action) {
      config = getLinkConfig[dataset.action](node)
    } else {
      config = getLinkConfig.external(node)
    }
    entityId = Entity.__create(
      'LINK',
      'MUTABLE',
      config,
    )
  }

  return entityId
}

export default getEntityId;
